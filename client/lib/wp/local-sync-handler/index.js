/**
 * Module dependencies
 */
import localforage from 'localforage';
import { blackList } from './endpoints-list';
import { postList } from './endpoints-list';
import queryString from 'qs';
import debugFactory from 'debug';
import Hashes from 'jshashes';

const debug = debugFactory( 'local-sync-handler' );

// expose localforage just to development
window.LF = localforage;

const postsListKey = 'local-posts-list';

// default config object
const defaultConfig = {
	driver: localforage.INDEXEDDB,
	name: 'calypso',
	version: 1.0,
	//size: 4980736,
	storeName: 'calypso-store',
	description: 'Calypso app storing data'
};

/**
 * LocalSyncHandler class
 */
export class LocalSyncHandler {
	/**
	 * Create a LocalSyncHandler instance
	 *
	 * @param {Object} [config] - sync config
	 * @param {Function} handler - wpcom handler function
	 *
	 * @return {Function} sync wrapper function
	 */
	constructor( config, handler ) {
		if ( 'function' === typeof config ) {
			handler = config;
			config = {};
		}

		this.config = Object.assign( {}, defaultConfig, config );
		this._handler = handler;
		return this.wrapper( handler );
	}

	wrapper( handler ) {
		const self = this;

		return function( params, fn ) {
			const cloneParams = Object.assign( {}, params );
			const path = params.path;
			let qs = params.query ? queryString.parse( params.query ) : {};

			// response has been sent flag
			let responseSent = false;

			// generate an unique resource key
			const key = self.generateKey( params );

			debug( 'starting to get resource ...' );

			// detect /sites/$site/post/* endpoints
			if ( 'GET' !== params.method && self.checkInList( path, postList ) ) {
				return self.handlerPostRequests( params, fn );
			};

			// conditions to skip the proxy
			//  - endpoint in blacklist

			if ( self.checkInList( path, blackList ) ) {
				debug( 'skip proxy', '\n' );
				return handler( params, fn );
			};

			self.retrieveResponse( key, function( err, data ) {
				if ( err ) {
					// @TODO improve error handling here
					console.error( err );
				}

				if ( data ) {
					// handle /site/$site/posts endpoint
					if ( /^\/sites\/.+\/posts$/.test( path ) ) {
						debug( '%o detected', '/sites/$site/posts' );

						responseSent = true;

						// detect type 'post', status 'draft'
						if (
							'post' === qs.type &&
							/draft/.test( qs.status ) &&
							! qs.page_handle
						) {
							self.getLocalPostsList( ( listErr, list ) => {
								if ( listErr ) {
									throw listErr;
								}

								if ( list && list.length ) {
									debug( 'add lodal posts to response' );

									// clone the response
									let cloneData = Object.assign( {}, data );

									// update found property
									cloneData.found += list.length;

									// merge list with posts list
									cloneData.posts = list.concat( cloneData.posts );

									console.log( `-> cloneData -> `, cloneData );
									fn( null, cloneData );
								}
							} );
						} else {
							debug( '%o already storaged %o.', path, data );
							fn( null, data );
						}
					}
				}

				debug( 'requesting to WP.com' );
				handler( params, ( resErr, resData ) => {
					if ( resErr ) {
						console.log( `-> resErr -> `, resErr );

						if ( responseSent ) {
							return;
						}

						return fn( resErr );
					}

					debug( 'WP.com response is here. %o', resData );

					if ( responseSent ) {
						debug( 'data is already stored. overwriting ...' );
					}

					if ( cloneParams.metaAPI && cloneParams.metaAPI.accessAllUsersBlogs ) {
						debug( 'skip proxy handler request ' );
						return fn( null, resData );
					}

					const isPostRequest = cloneParams &&
						cloneParams.method &&
						'post' === cloneParams.method.toLowerCase();

					if ( ! isPostRequest ) {
						let storingData = {
							response: resData,
							params: cloneParams
						};

						self.storeResponse( key, storingData );
					}

					if ( ! responseSent ) {
						fn( err, resData );
					}
				} );
			} );
		};
	}

	/**
	 * Generate a key from the given param object
	 *
	 * @param {Object} params - request parameters
	 * @return {String} request key
	 */
	generateKey( params ) {
		var key = params.apiVersion || '';
		key += '-' + params.method;
		key += '-' + params.path;

		if ( params.query ) {
			key += '-' + params.query;
		}

		debug( 'generating hash ... ' );
		let hash = new Hashes.SHA1().hex( key );

		// @TODO remove
		hash = key;
		debug( 'key: %o', hash );
		return hash;
	}

	retrieveResponse( key, fn = () => {} ) {
		localforage.config( this.config );
		debug( 'getting data from %o key', key );

		localforage.getItem( key, ( err, data ) => {
			if ( err ) {
				return fn( err )
			}

			if ( ! data ) {
				return fn();
			}

			fn( null, data.response || data );
		} );
	}

	/**
	 * Store the WP.com REST-API response with the given key.
	 *
	 * @param {String} key - local forage key identifier
	 * @param {Object} data - REST-API endoint response
	 * @param {Function} [fn] - callback
	 */
	storeResponse( key, data, fn = () => {} ) {
		localforage.config( this.config );
		debug( 'storing data in %o key', key );

		// clean some fields from endpoint response
		if ( data.response ) {
			delete data.response._headers;
		}

		localforage.setItem( key, data, fn );
	}

	checkInList( path, list ) {
		let inList = false;

		for ( let i = 0; i < list.length; i++ ) {
			let pattern = list[ i ];
			let re = new RegExp( pattern );
			if ( re.test( path ) ) {
				inList = true;
				continue;
			}
		}

		return inList;
	}

	handlerPostRequests( params, fn ) {
		console.log( `-> params -> `, params );
		const path = params.path;

		let isNewPostRequest = /^\/sites\/.*\/new/.test( path );
		if ( isNewPostRequest ) {
			/*
			this._handler( params, ( err, data ) => {
				console.log( `-> err -> `, err );
				console.log( `-> data -> `, data );
			} );
			*/

			this.addNewLocalPost( params, fn );
		} else {
			this.editLocalPost( params, fn );
		}
		return;
	}

	addNewLocalPost( data, fn ) {
		let body = data.body;
		// create a random ID
		const postId = Number( `0.${String( Math.random() ).substr( 2 )}` );

		body.ID = postId;
		body.isLocal = true;

		// create key for GET POST
		let postGETKey = this.generateKey( {
			apiVersion: data.apiVersion,
			path: `/sites/${data.body.site_ID}/posts/${postId}`,
			method: 'GET',
			query: 'context=edit&meta=autosave'
		} );

		debug( 'storging new post(%o)', postId );
		this.storeResponse( postGETKey, body, ( err, newPost ) => {
			if ( err ) {
				throw err;
			}

			this.addNewPostKeyToLocalList( postGETKey, postListErr => {
				if ( postListErr ) {
					throw postListErr;
				}

				fn( null, newPost );
			} );
		} );
	}

	editLocalPost( data, fn ) {
		console.log( `-> data -> `, data );
		fn();
	}

	addNewPostKeyToLocalList( key, fn ) {
		// add post to local posts list
		localforage.config( this.config );
		localforage.getItem( postsListKey, ( err, list ) => {
			if ( err ) {
				throw err;
			}

			list = list || [];
			list.push( key );
			localforage.setItem( postsListKey, list, fn );
		} );
	}

	getLocalPostsList( fn ) {
		localforage.config( this.config );
		localforage.getItem( postsListKey, ( err, list ) => {
			if ( err ) {
				throw err;
			}

			let c = 0;
			let localPosts = [];

			list.forEach( key => {
				c++;
				this.retrieveResponse( key, ( errPost, post ) => {
					if ( err ) {
						throw err;
					}

					localPosts.push( post );
					--c || fn( null, localPosts );
				} );
			} );
		} );
	}
}
