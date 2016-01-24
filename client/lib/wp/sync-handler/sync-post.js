/**
 * Module dependencies
 */
import debugFactory from 'debug';

// debug instance
const debug = debugFactory( 'calypso:local-sync-handler:sync-post' );

const regExp = /\/sites\/(.+)\/posts\/(\d+|local\.\d+|new)$/;

/**
 * Detect the current state of the `post` request
 * according to the given parameters: path, request method, etc.
 *
 * @param {Object} reqParams - request parameters
 * @param {SyncHandler} syncHandler - sync handler instance
 * @param {Function} callback - callback function
 * @return {Boolean} true if the request will be handled
 */
export const syncPost = ( reqParams, syncHandler, callback ) => {
	// get initial data
	const { path, body, method } = reqParams;
	const { reqHandler } = syncHandler;

	if ( ! ( 'GET' !== method && regExp.test( path ) ) ) {
		return false;
	}

	debug( 'post edition request detected!' );
	let ID, site_ID, global_ID, key, localData, isLocal = true;

	// get data from url path
	let urlData = path.match( regExp );

	if ( ! urlData ) {
		return callback( new Error( '%o path in not supported' ) );
	}

	// get site_ID from the request path
	site_ID = urlData[ 1 ];

	/**
	 * Generate a record key used to store the post object locally.
	 *
	 * @return {String} key identifier
	 */
	const generatePostKey = () => {
		return syncHandler.generateKey( {
			apiVersion: '1.1',
			path: `/sites/${site_ID}/posts/${ID}`,
			method: 'GET',
			query: 'context=edit&meta=autosave'
		} );
	}

	const syncLocalPost = ( fn = () => {} ) => {
		debug( 'start to sync %o post', ID );

		if ( isLocal && localData.__sync.syncing ) {
			debug( '%o post is syncing. avoid this sync instance', ID );
			return fn();
		}

		localData.__sync.syncing = true;
		syncHandler.storeRecord( key, localData, err => {
			if ( err ) {
				return fn( err );
			}

			// correct path to send a request to add or edit the post
			if ( isLocal ) {
				reqParams.path = reqParams.path.replace( /\/local\.\d+/, '/new' );
			}

			// update body to send
			reqParams.body = localData.body;

			reqHandler( reqParams, ( reqErr, data ) => {
				if ( reqErr ) {
					return fn( reqErr );
				}

				if ( data ) {
					debug( '%o post synced - action: %o', data.ID, isLocal ? 'new' : 'edit' );
					localData.__sync.syncing = false;
					localData.__sync.synced = new Date().toString();

					// override the local post
					localData.body = data;
					syncHandler.storeRecord( key, localData, ( storeErr, storePost ) => {
						if ( storeErr ) {
							return fn( storeErr );
						}

						debug( 'post synced: %o => %o', ID, storePost.body.ID );
					} );
				}
			} );
		} );
	}

	const storeNewPost = fn => {
		const data = {
			body: Object.assign(
				body,
				{ ID, global_ID, isLocal: true }
			),
			__sync: {
				key,
				type: 'post',
				synced: false,
				syncing: false
			}
		};

		syncHandler.storeRecord( key, data, ( err, newPost ) => {
			if ( err ) {
				return fn( err );
			}

			syncHandler.addTaskToQueue( key, addKeyErr => {
				if ( addKeyErr ) {
					throw addKeyErr;
				}

				fn( null, newPost );
			} );
		} );
	}

	const storeEditPost = fn => {
		syncHandler.retrieveRecord( key, ( retrieveErr, localPost ) => {
			if ( retrieveErr ) {
				return fn( retrieveErr );
			}

			// update post body in the local post
			let updatedData = Object.assign(
				{},
				localPost,
				{ body: Object.assign( {}, localPost.body, body ) }
			);

			if ( isLocal && localPost.body.ID === ID ) {
				debug( 'still working locally. overriding local storage ...' );
				return syncHandler.storeRecord( key, updatedData, fn );
			}

			// update global data
			ID = localPost.body.ID;

			// * backend process * delete local.xxx stored data
			syncHandler.removeRecord( key, removeErr => {
				if ( removeErr ) {
					return fn( removeErr );
				}

				// update local key
				key = generatePostKey();
				syncHandler.storeRecord( key, updatedData, fn );
			} );
		} );
	}

	const handleNewPost = fn => {
		// create a random post ID and global_ID
		ID = `local.${String( Math.random() ).substr( 2, 6 )}`;
		global_ID = 'global.' + ID;

		key = generatePostKey();

		// store the new post and response immediately
		storeNewPost( ( newPostErr, newPostData ) => {
			if ( newPostErr ) {
				return fn( newPostErr );
			}

			fn( null, newPostData.body );

			// update local data
			localData = newPostData;

			// try to sync immediately (background process)
			syncLocalPost();
		} );
	}

	const handleEditPost = fn => {
		key = generatePostKey();

		storeEditPost( ( editPostErr, editedPost ) => {
			if ( editPostErr ) {
				return fn( editPostErr );
			}

			fn( null, editedPost.body );

			// update local data
			localData = editedPost;

			// try to sync immediately (background process)
			syncLocalPost();
		} );
	}

	/*** Start to process the request ***/

	// handle `new` post request ?
	if ( 'new' === urlData[ 2 ] ) {
		debug( '%o post request detected', 'new' );
		return handleNewPost( callback );
	}

	isLocal = /^local\.\d+$/.test( urlData[ 2 ] );

	// handle `edit` post request
	debug( '%o post request detected', 'edit' );

	// set post ID from request path
	ID = urlData[ 2 ];
	handleEditPost( callback );
	return true;
};
