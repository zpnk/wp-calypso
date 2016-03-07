/**
 * External dependencies
 */
import { expect } from 'chai';
import mockery from 'mockery';
import ms from 'ms';

/**
 * Internal dependencies
 */
import { generateKey } from '../utils';
import { RECORDS_LIST_KEY } from '../constants';
import * as testData from './data';

let cacheIndex, localData;

const clearLocal = () => localData = {};
const setRecordsList = recordsList => localData[ RECORDS_LIST_KEY ] = recordsList;

const localforageMock = {
	getLocalForage() {
		return {
			setItem( key, data ) {
				return new Promise( resolve => {
					localData[ key ] = data;
					resolve();
				} )
			},
			getItem( key ) {
				return new Promise( resolve => {
					resolve( localData[ key ] );
				} );
			},
			removeItem( key ) {
				return new Promise( resolve => {
					delete localData[ key ];
					resolve();
				} );
			},
			keys() {
				return new Promise( resolve => {
					resolve( Object.keys( localData ) );
				} )
			}
		}
	}
};

describe( 'cache-index', () => {
	before( () => {
		mockery.enable( {
			warnOnReplace: false,
			warnOnUnregistered: false
		} );
		mockery.registerMock( 'lib/localforage', localforageMock );
		( { cacheIndex } = require( '../cache-index' ) );
	} );

	after( function() {
		mockery.disable();
	} );

	beforeEach( clearLocal ); // also do inside nested blocks with >1 test

	describe( '#getAll', () => {
		beforeEach( clearLocal );

		it( 'should return undefined for empty localforage', ( done ) => {
			return cacheIndex.getAll()
			.then( ( res ) => {
				expect( res ).to.equal( undefined );
				done();
			} );
		} );
		it( 'should return index from localforage and nothing else', ( done ) => {
			const { recordsList } = testData;
			localData = {
				someStoredRecord: 1,
				someOtherRecord: 2,
			};
			localData[ RECORDS_LIST_KEY ] = recordsList;
			return cacheIndex.getAll()
			.then( ( res ) => {
				expect( res ).to.equal( recordsList );
				done();
			} );
		} );
	} );

	describe( '#addItem', () => {
		it( 'should add item to empty index', ( done ) => {
			const key = 'sync-record-365dbe1d91c3837b050032189c7b66ee60477bb0';
			return cacheIndex.addItem( key )
			.then( () => {
				const currentIndex = localData[ RECORDS_LIST_KEY ];
				expect( currentIndex ).to.be.an( 'array' );
				expect( currentIndex[0] ).to.have.property( 'key', key );
				expect( currentIndex[0] ).to.have.property( 'timestamp' );
				done();
			} );
		} );
	} );

	describe( '#removeItem', () => {
		it( 'should remove item from a populated index', ( done ) => {
			const { recordsList } = testData;
			const key = 'sync-record-365dbe1d91c3837b050032189c7b66ee60477bb0';
			setRecordsList( recordsList );
			return cacheIndex.removeItem( key )
			.then( () => {
				const currentIndex = localData[ RECORDS_LIST_KEY ];
				expect( currentIndex.length ).to.eql( 2 );
				done();
			} );
		} );
	} );

	describe( '#pruneRecordsFrom', () => {
		it( 'should prune old records', ( done ) => {
			const {
				postListParams,
				postListParamsDifferent,
				postListLocalRecord,
			} = testData;
			const postListSecondRecord = Object.assign( {}, postListLocalRecord );
			const key1 = generateKey( postListParams );
			const key2 = generateKey( postListParamsDifferent );
			const now = Date.now();
			const yesterday = now - ms( '1 day' );
			localData = {
				[key1]: postListLocalRecord,
				[key2]: postListSecondRecord,
			};
			setRecordsList( [
				{ key: key1, timestamp: now },
				{ key: key2, timestamp: yesterday },
			] );
			return cacheIndex.pruneRecordsFrom( '1 hour' )
			.then( () => {
				const currentIndex = localData[ RECORDS_LIST_KEY ];
				expect( currentIndex ).to.eql( [ { key: key1, timestamp: now } ] );
				expect( localData ).to.have.property( key1, postListLocalRecord );
				expect( localData ).to.have.property( RECORDS_LIST_KEY );
				expect( localData ).to.not.have.property( key2 );
				done();
			} );
		} );
	} );

	describe( '#clearAll', () => {
		it( 'should clear all sync records and nothing else', ( done ) => {
			const { localDataFull } = testData;
			localData = Object.assign( { someRecord: 1 }, localDataFull );
			return cacheIndex.clearAll()
			.then( () => {
				expect( localData ).to.eql( { someRecord: 1 } );
				done();
			} )
		} );
	} );

	describe( '#clearPageSeries', () => {
		it( 'should clear records with matching pageSeriesKey and leave other records intact', ( done ) => {
			const { postListParams, postListParamsDifferent, postListLocalRecord, postListParamsNextPage } = testData;
			const postPageOneKey = generateKey( postListParams );
			const postPageTwoKey = generateKey( postListParamsNextPage );
			const postListDifferentKey = generateKey( postListParamsDifferent );
			const pageSeriesKey = postPageOneKey;
			const now = Date.now();
			localData = {
				someOtherRecord: 1,
				[ postPageOneKey ]: postListLocalRecord,
				[ postPageTwoKey ]: Object.assign( {}, postListLocalRecord ),
				[ postListDifferentKey ]: Object.assign( {}, postListLocalRecord ),
			};
			setRecordsList( [
				{ key: postPageOneKey, pageSeriesKey: pageSeriesKey, timestamp: now },
				{ key: postPageTwoKey, pageSeriesKey: pageSeriesKey, timestamp: now },
				{ key: postListDifferentKey, timestamp: now },
			] );
			return cacheIndex.clearPageSeries( postListParamsNextPage )
			.then( () => {
				expect( localData ).to.eql( { someOtherRecord: 1, [ postListDifferentKey ]: postListLocalRecord, [ RECORDS_LIST_KEY ]: [ { key: postListDifferentKey, timestamp: now } ] } );
				done();
			} );
		} );
	} );
} );
