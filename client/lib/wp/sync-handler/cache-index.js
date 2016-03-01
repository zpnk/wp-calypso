/**
 * External dependencies
 */
import debugFactory from 'debug';
import ms from 'ms';
import negate from 'lodash/negate';
import matchesProperty from 'lodash/matchesProperty';
import filter from 'lodash/filter';
import difference from 'lodash/difference';
import omit from 'lodash/omit';

/**
 * Internal dependencies
 */
import { getLocalForage } from 'lib/localforage';

/**
 * Module variables
 */
const localforage = getLocalForage();
const debug = debugFactory( 'calypso:sync-handler:cache' );

const RECORDS_LIST_KEY = 'records-list';
const SYNC_RECORD_REGEX = /^sync-record-\w+$/;
const LIFETIME = '2 days';

/**
 * Check it the given key is a `sync-record-` key
 *
 * @param {String} key - record key
 * @return {Boolean} `true` if it's a sync-record-<key>
 */
const isSyncRecordKey = key => SYNC_RECORD_REGEX.test( key );

export const cacheIndex = {
	getAll() {
		return localforage.getItem( RECORDS_LIST_KEY );
	},

	/**
	 * Retrieve all records except the record
	 * that matches with the given key.
	 *
	 * @param {String} key - compare records with this key
	 * @return {Promise} promise
	 */
	getAllExcluding( key ) {
		const dropMatches = records => filter( records,
			negate( matchesProperty( 'key', key ) )
		);

		return new Promise( ( resolve, reject ) => {
			this.getAll()
				.then( dropMatches )
				.then( resolve )
				.catch( reject );
		} );
	},

	/**
	 * Add the given `key` into the records-list object
	 * adding at the same a timestamp (now).
	 * If the pair key-timestamp already exists it will be updated.
	 *
	 * @param {String} key - record key
	 * @return {Promise} promise
	 */
	addItem( key, pageSeriesKey = null ) {
		return this.getAllExcluding( key ).then( records => {
			debug( 'adding %o record', key );
			const record = { key, timestamp: Date.now() };
			if ( pageSeriesKey ) {
				record.pageSeriesKey = pageSeriesKey
			}
			return localforage.setItem( RECORDS_LIST_KEY, [
				...records,
				record
			] );
		} );
	},

	removeItem( key ) {
		return this.getAllExcluding( key ).then( records => {
			debug( 'removing %o record', key );
			return localforage.setItem( RECORDS_LIST_KEY, records );
		} );
	},

	dropOlderThan( lifetime ) {
		const dropElders = records => {
			const removeRecords = filter( records, rec => {
				return Date.now() - lifetime > rec.timestamp;
			} );

			return {
				removeRecords,
				retainRecords: difference( records, removeRecords )
			}
		};

		return new Promise( ( resolve, reject ) => {
			this.getAll()
			.then( dropElders )
			.then( resolve )
			.catch( reject );
		} );
	},

	/**
	 * It's a cleaning method and it should be used to re-sync the whole data.
	 * Calling this method all `sync-records-<key>` records will be
	 * removed plus the `records-list` one.
	 *
	 * @return {Promise} promise
	 */
	clearAll() {
		return localforage.keys().then( keys => {
			const syncHandlerKeys = keys.filter( isSyncRecordKey );
			const itemsPromises = syncHandlerKeys.map( key => localforage.removeItem( key ) );
			const recordsPromise = localforage.removeItem( RECORDS_LIST_KEY );
			return Promise.all( [ ...itemsPromises, recordsPromise ] )
				.then( debug( '%o records removed', syncHandlerKeys.length + 1 ) );
		} );
	},

	/**
	 * Prune old records depending of the given lifetime
	 *
	 * @param {Number|String} lifetime - lifetime (ms or natural string)
	 * @return {Promise} promise
	 */
	pruneRecordsFrom( lifetime = LIFETIME ) {
		lifetime = typeof lifetime === 'number'
			? lifetime
			: ms( lifetime );

		debug( 'start to prune records older than %s', ms( lifetime, { long: true } ) );

		return this.dropOlderThan( lifetime ).then( this.removeRecordsByList );
	},

	removeRecordsByList( data ) {
		return new Promise( ( resolve ) => {
			const { removeRecords, retainRecords } = data;
			if ( ! removeRecords.length ) {
				return debug( 'No records to remove' );
			}
			const droppedPromises = removeRecords.map( item => {
				localforage.removeItem( item.key )
			} );
			const recordsListPromise = localforage.setItem( RECORDS_LIST_KEY, retainRecords )
			return Promise.all( [ ...droppedPromises, recordsListPromise ] )
			.then( () => {
				debug( '%o records removed', removeRecords.length + 1 )
				resolve();
			} );
		} );
	},

	clearPageSeries( reqParams ) {
		return new Promise( ( resolve ) => {
			const { generateKey } = require( './' );
			const pageSeriesKey = generateKey( omit( reqParams, 'next_page' ) );
			const pickPageSeries = ( records ) => {
				const removeRecords = filter( records, record => record.pageSeriesKey === pageSeriesKey );
				return {
					removeRecords,
					retainRecords: difference( records, removeRecords ),
				}
			}
			this.getAll()
			.then( pickPageSeries )
			.then( this.removeRecordsByList )
			.then( resolve );
		} )
	}
}
