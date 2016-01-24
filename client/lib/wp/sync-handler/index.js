
/**
 * Module dependencies
 */
import localforage from 'localforage';
import { blackList } from './endpoints-list';
import queryString from 'qs';
import Hashes from 'jshashes';

import { syncPost } from './sync-post';
//import { postsList } from './sync-posts-list';

import debugFactory from 'debug';
const debug = debugFactory( 'calypso:local-sync-handler' );

// expose localforage just for development
window.LF = localforage;

const QUEUE_KEY = 'local-posts-list';

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
 * SyncHandler class
 */
export class SyncHandler {
	/**
	 * Create a SyncHandler instance
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
		this.reqHandler = handler;
		return this.wrapper( handler );
	}

	wrapper( handler ) {
		const self = this;

		return function( params, fn ) {
			if ( params.metaAPI && params.metaAPI.accessAllUsersBlogs ) {
				debug( 'skip proxy handler request ' );
				return self.reqHandler( params, fn );
			}

			const cloneParams = Object.assign( {}, params );
			const { path } = cloneParams;
			let qs = params.query ? queryString.parse( params.query ) : {};

			// response has been sent flag
			let responseSent = false;

			// generate an unique resource key
			const key = self.generateKey( params );

			debug( 'starting to get resource ...' );

			// detect post edition request
			if ( syncPost( cloneParams, self, fn ) ) {
				return;
			};

			// conditions to skip the proxy
			//  - endpoint in blacklist

			if ( self.checkInList( path, blackList ) ) {
				debug( 'skip proxy', '\n' );
				return handler( params, fn );
			};

			self.retrieveRecord( key, function( err, data ) {
				if ( err ) {
					// @TODO improve error handling here
					console.error( err );
				}

				if ( data ) {
					responseSent = true;

					// handle /site/$site/posts endpoint
					if ( /^\/sites\/.+\/posts$/.test( path ) ) {
						debug( '%o detected', '/sites/$site/posts' );

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
									const cloneData = Object.assign( {}, data );
									let newData = { posts: [], found: 0 };

									// update found property
									newData.found = cloneData.found + list.length;

									// merge list with posts list
									newData.posts = list.concat( cloneData.posts );

									fn( null, newData );
								}
							} );
						} else {
							// no `draft` posts list
							fn( null, data.body );
						}
					} else {
						debug( '%o already storaged %o.', path, data );
						fn( null, data.body );
					}
				}

				// void request for local.XXXXX post
				if ( /^\/sites\/.+\/local\.\d+$/.test( path ) ) {
					debug( 'avoid sending request to WP.com for local.XXX post' );
					return;
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

					const isPostRequest = cloneParams &&
						cloneParams.method &&
						'post' === cloneParams.method.toLowerCase();

					if ( ! isPostRequest ) {
						let storingData = {
							__sync: {
								key,
								synced: new Date().toString(),
								syncing: false
							},
							body: resData,
							params: cloneParams
						};

						self.storeRecord( key, storingData );
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

	retrieveRecord( key, fn = () => {} ) {
		localforage.config( this.config );
		debug( 'getting data from %o key', key );

		localforage.getItem( key, ( err, data ) => {
			if ( err ) {
				return fn( err )
			}

			fn( null, data );
		} );
	}

	/**
	 * Store the WP.com REST-API response with the given key.
	 *
	 * @param {String} key - local forage key identifier
	 * @param {Object} data - object data to store
	 * @param {Function} [fn] - callback
	 */
	storeRecord( key, data, fn = () => {} ) {
		localforage.config( this.config );
		debug( 'storing data in %o key', key );
		localforage.setItem( key, data, fn );
	}

	removeRecord( key, fn = () => {} ) {
		localforage.config( this.config );
		debug( 'removing %o key', key );

		localforage.removeItem( key, fn );
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

	addTaskToQueue( key, fn ) {
		// add post to local posts list
		localforage.config( this.config );
		localforage.getItem( QUEUE_KEY, ( err, list ) => {
			if ( err ) {
				throw err;
			}

			list = list || [];
			list.unshift( key );
			debug( '%o key added to queue list. count: ', key, list.length );
			localforage.setItem( QUEUE_KEY, list, fn );
		} );
	}

	getLocalPostsList( fn ) {
		localforage.config( this.config );
		localforage.getItem( QUEUE_KEY, ( err, list ) => {
			if ( err ) {
				throw err;
			}

			let c = 0;
			let localQueue = [];

			list.forEach( key => {
				c++;
				this.retrieveRecord( key, ( errPost, post ) => {
					if ( err ) {
						throw err;
					}

					localQueue.push( post );
					--c || fn( null, localQueue );
				} );
			} );
		} );
	}
}
