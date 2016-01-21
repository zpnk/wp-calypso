/**
 * Module dependencies
 */
import localforage from 'localforage';
import { blackList } from './endpoints-list';
import { postList } from './endpoints-list';
import debugFactory from 'debug';
import Hashes from 'jshashes';

// expose localforage just to development
window.LF = localforage;

const debug = debugFactory( 'local-sync-handler' );

// default config object
const defaultConfig = {
	driver: localforage.INDEXEDDB,
	name: 'calypso',
	version: 1.0,
	//size: 4980736,
	storeName: 'calypso-store',
	description: 'Calypso app storing fata'
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
		return this.wrapper( handler );
	}

	wrapper( handler ) {
		const self = this;

		return function( params, fn ) {
			const cloneParams = Object.assign( {}, params );
			const path = params.path;

			// response has been sent flag
			let responseSent = false;

			// generate an unique resource key
			const key = self.generateKey( params );

			console.log( ' ' );
			debug( 'starting to get resurce ...' );

			if ( self.checkInList( path, postList ) ) {
				responseSent = true;
				let isNewPostRequest = /^\/sites\/.*\/new/.test( path );
				if ( isNewPostRequest ) {
					return self.newLocalPost( params, fn );
				} else {
					return self.editLocalPost( params, fn );
				}
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
					debug( '%o already storaged %o. Let\'s be optimistic.', path, data );
					fn( null, data );
					responseSent = true;
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

					// coditions to do not store
					//  - POST method

					const isPostRequest = 'post' === cloneParams.method.toLowerCase();

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
			};

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
		debug( 'storing data in %o key', key );

		// clean some fields from endpoint response
		delete data.response._headers;

		localforage.config( this.config );
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

	newLocalPost( data, fn ) {
		let body = data.body;
		// create a random ID
		const postId = String( Math.random() ).substr( 2 );

		body.ID = 'local.' + postId;
		body.isLocal = true;

		debug( 'sending added post %s locally', postId );
		fn( null, body );
	}

	editLocalPost( data, fn ) {
		console.log( `-> data -> `, data );
		fn();
	}
}
