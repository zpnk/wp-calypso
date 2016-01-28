/**
 * Module dependencies
 */
import debugFactory from 'debug';

// debug instance
const debug = debugFactory( 'calypso:sync-handler:sync-post' );

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
	const { pathname } = document.location;
	const { reqHandler } = syncHandler;

	if ( ! ( 'GET' !== method && regExp.test( path ) ) ) {
		return false;
	}

	debug( 'post edition request detected!' );
	let ID, site_ID, global_ID,
		localPostID, key, localData,
		hasLocalID = true;

	// get data from url path
	let urlData = path.match( regExp );

	if ( ! urlData ) {
		debug( '%o path in not supported', path );
		return false;
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

	const getPathToAdd = () => {
		return `/sites/${site_ID}/posts/new`;
	}

	const getPathToUpdate = ( postID = ID ) => {
		return `/sites/${site_ID}/posts/${postID}`;
	}

	const syncLocalPost = ( fn = () => {} ) => {
		debug( 'start to sync %o post', ID );
		let isNew = localData.body.ID && /^local\.\d+$/.test( localData.body.ID );

		debug( 'isNew: %o', isNew );

		if ( localData.__sync.syncing ) {
			let from = +new Date() - +new Date( localData.__sync.syncing );
			debug( '%o post syncing (%o)', ID, from + 'ms ago' );
			return fn();
		}

		// update syncing property
		localData.__sync.syncing = new Date().toString();
		syncHandler.storeRecord( key, localData, updateErr => {
			if ( updateErr ) {
				return fn( updateErr );
			}

			// correct path to send the POST request to add or edit the post
			if ( isNew ) {
				reqParams.path = getPathToAdd();

				// clean temporal data from the post body
				let clonedBody = Object.assign( {}, reqParams.body );
				delete clonedBody.ID;
				delete clonedBody.global_ID;
				delete clonedBody.isLocal;
				reqParams.body = clonedBody;
			} else {
				reqParams.path = getPathToUpdate( ID );
			}

			reqHandler( reqParams, ( reqErr, data ) => {
				if ( reqErr ) {
					// @TODO imprive handling error
					// synced: false - syncing: false
					console.error( reqErr );
					return fn( reqErr );
				}

				if ( data ) {
					localData.__sync.syncing = false;
					localData.__sync.synced = new Date().toString();

					// @TODO implement here dirty post?
					// merge before to send the POST request?
					// override/add the local post
					localData.body = data;

					syncHandler.storeRecord( key, localData, ( storeErr, storedPost ) => {
						if ( storeErr ) {
							return fn( storeErr );
						}

						debug( '%o post synced -> %o', ID, storedPost.body.ID );

						// once synced remove the key from the queue
						syncHandler.removeTaskFromQueue( key, fn );
					} );
				}
			} );
		} );
	}

	const storeNewPost = fn => {
		const data = {
			body: Object.assign(
				body,
				{
					ID,
					global_ID,
					isLocal: true,
					status: 'draft'
				}
			),
			__sync: {
				ID,
				key,
				type: 'post',
				synced: false,
				syncing: false
			}
		};

		syncHandler.addTaskToQueue( key, data, fn );
	}

	const storeEditPost = fn => {
		syncHandler.retrieveRecord( key, ( retrieveErr, localPost ) => {
			if ( retrieveErr ) {
				return fn( retrieveErr );
			}

			if ( ! localPost ) {
				debug( 'LOCAL POST NOT FOUND' );
				return fn( new Error( 'local post not found' ) );
			}

			// update post.body in the local post
			let updatedData = Object.assign(
				{},
				localPost,
				{ body: Object.assign( {}, localPost.body, body ) }
			);

			if ( hasLocalID && localPost.body.ID === ID ) {
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
				syncHandler.addTaskToQueue( key, updatedData, fn );
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
		handleNewPost( callback );
		return true;
	}
	// handle `edit` post request
	debug( '%o post request detected', 'edit' );

	// get post ID from request path
	ID = urlData[ 2 ];

	// get localPostID from the pathname of the browser
	localPostID = pathname.match( /\/post\/.+\/(local\.\d+)/ );
	localPostID = localPostID ? localPostID[ 1 ] : null;

	hasLocalID = /^local\.\d+$/.test( ID );

	debug( 'post ID detected: %o', ID );

	handleEditPost( callback );
	return true;
};
