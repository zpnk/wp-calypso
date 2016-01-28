
/**
 * Module dependencies
 */
import config from 'config';
import localforage from 'localforage';
import Hashes from 'jshashes';
import { syncPost } from './sync-post';

import debugFactory from 'debug';
const debug = debugFactory( 'calypso:sync-handler' );

// defaults
const defaults = config( 'sync-handler-defaults' );
defaults.driver = localforage[ defaults.driver ];

const QUEUE_KEY = defaults.QUEUE_KEY;

/**
 * SyncHandler class
 */
export class SyncHandler {
	/**
	 * Create a SyncHandler instance
	 *
	 * @param {Object} [setup] - sync setup
	 * @param {Function} handler - wpcom handler
	 *
	 * @return {Function} sync-handler wrapper
	 */
	constructor( setup, handler ) {
		if ( 'function' === typeof setup ) {
			handler = setup;
			setup = {};
		}

		this.setup = Object.assign( {}, defaults, setup );
		this.reqHandler = handler;
		return this.wrapper( handler );
	}

	wrapper( handler ) {
		const self = this;

		return function( params, fn ) {
			// detect and no-sync proxy connection request
			if ( params.metaAPI && params.metaAPI.accessAllUsersBlogs ) {
				debug( 'skip - non-sync -proxy-handler request detected' );
				return self.reqHandler( params, fn );
			}

			const clonedParams = Object.assign( {}, params );
			const { path } = clonedParams;

			// response sent flag
			let responseSent = false;

			// generate an unique resource key
			const key = self.generateKey( params );

			debug( 'starting to get resource ...' );

			// detect post edition request
			if ( syncPost( clonedParams, self, fn ) ) {
				return;
			}

			self.retrieveRecord( key, function( err, localRecord ) {
				if ( err ) {
					// @TODO improve error handling here
					console.error( err );
				}

				// let's be optimistic
				if ( localRecord ) {
					responseSent = true;

					debug( '%o stored(%o). Let\'s be optimistic ...\n', path, localRecord );
					fn( null, localRecord.body );
				} else {
					debug( 'No data for %o\n', path );
				}

				// * background sync process *
				debug( 'requesting %o to WP.com', path );
				handler( params, ( resErr, resData ) => {
					if ( resErr ) {
						if ( responseSent ) {
							return;
						}

						return fn( resErr );
					}

					debug( 'WP.com response %o -> %o', path, resData );

					const isPostRequest = clonedParams &&
						clonedParams.method &&
						'post' === clonedParams.method.toLowerCase();

					if ( ! isPostRequest ) {
						if ( responseSent ) {
							debug( 'data is already stored. Overwriting ...' );
						}

						// remove some response fields before to store
						delete resData._headers;

						let storingData = {
							__sync: {
								key,
								synced: new Date().toString(),
								syncing: false
							},
							body: resData,
							params: clonedParams
						};

						self.storeRecord( key, storingData );
					} else {
						debug( 'skip - non sync request: [%o] %o - %o\n', path, params, resData );
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
	 * @param {Boolean} hashCodification - codificate key when it's true
	 * @return {String} request key
	 */
	generateKey( params, hashCodification = false ) {
		var key = params.apiVersion || '';
		key += '-' + params.method;
		key += '-' + params.path;

		if ( params.query ) {
			key += '-' + params.query;
		}

		if ( hashCodification ) {
			key = new Hashes.SHA1().hex( key );
		}

		debug( 'key: %o', key );
		return key;
	}

	retrieveRecord( key, fn = () => {} ) {
		localforage.config( this.setup );
		debug( 'getting data from %o key\n', key );
		localforage.getItem( key, fn );
	}

	storeRecord( key, data, fn = () => {} ) {
		localforage.config( this.setup );
		debug( 'storing data in %o key\n', key );
		localforage.setItem( key, data, fn );
	}

	removeRecord( key, fn = () => {} ) {
		localforage.config( this.setup );
		debug( 'removing %o key\n', key );
		localforage.removeItem( key, fn );
	}

	addTaskToQueue( key, data, fn ) {
		localforage.config( this.config );

		// first add the record ...
		this.storeRecord( key, data, ( storeErr, storedData ) => {
			if ( storeErr ) {
				return fn( storeErr );
			}

			// ... and then add the key into the queue
			localforage.getItem( QUEUE_KEY, ( err, queue ) => {
				if ( err ) {
					return fn( err );
				}

				queue = queue || [];

				if ( queue.findIndex( i => i === key ) >= 0 ) {
					debug( '%o task already added to queue. skip ...', key );
					return fn( null, storedData );
				}

				queue.unshift( key );
				localforage.setItem( QUEUE_KEY, queue, addTaskErr => {
					if ( addTaskErr ) {
						return fn( addTaskErr );
					}

					debug( '%o key added to queue. count: ', key, queue.length );
					fn( null, storedData );
				} );
			} );
		} );
	}

	removeTaskFromQueue( key, fn ) {
		localforage.config( this.config );
		localforage.getItem( QUEUE_KEY, ( err, queue ) => {
			if ( err ) {
				return fn( err );
			}

			if ( ! queue || ! queue.length ) {
				return fn();
			}

			let index = queue.findIndex( i => i === key );

			if ( index < 0 ) {
				debug( '%o not found into queue. skip ...', key );
				return fn();
			}

			queue.splice( index, 1 );
			debug( 'removing %o from queue. pos %o. count: %o', key, index, queue.length );
			localforage.setItem( QUEUE_KEY, queue, fn );
		} );
	}
}
