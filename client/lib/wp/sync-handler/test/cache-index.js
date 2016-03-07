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

let cacheIndex, localData;

const clearLocal = () => localData = {};
const setRecordsList = recordsList => localData[ 'records-list' ] = recordsList;

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

		it( 'should return undefined for empty localforage', () => {
			return cacheIndex.getAll()
			.then( ( res ) => {
				expect( res ).to.equal( undefined );
			} );
		} );
		it( 'should return index from localforage and nothing else', () => {
			localData = {
				test: 1,
				test2: 2,
			};
			localData[ RECORDS_LIST_KEY ] = 3;
			return cacheIndex.getAll()
			.then( ( res ) => {
				expect( res ).to.equal( 3 );
			} );
		} );
	} );

	describe( '#addItem', () => {
		it( 'should add item to empty index', () => {
			return cacheIndex.addItem( 'testKey' )
			.then( () => {
				const currentIndex = localData[ 'records-list' ];
				expect( currentIndex ).to.be.an( 'array' );
				expect( currentIndex[0] ).to.have.property( 'key', 'testKey' );
				expect( currentIndex[0] ).to.have.property( 'timestamp' );
			} );
		} );
	} );

	describe( '#removeItem', () => {
		it( 'should remove item from a populated index', () => {
			setRecordsList( [
				{ key: 'key1' },
				{ key: 'key2' },
				{ key: 'key3' },
			] );
			return cacheIndex.removeItem( 'key2' )
			.then( () => {
				const currentIndex = localData[ 'records-list' ];
				expect( currentIndex ).to.eql( [ { key: 'key1' }, { key: 'key3' } ] );
			} );
		} );
	} );

	describe( '#pruneRecordsFrom', () => {
		it( 'should prune old records', () => {
			const now = Date.now();
			const yesterday = now - ms( '1 day' );
			localData = {
				key1: 'test1',
				key2: 'test2',
			};
			setRecordsList( [
				{ key: 'key1', timestamp: now },
				{ key: 'key2', timestamp: yesterday },
			] );
			return cacheIndex.pruneRecordsFrom( '1 hour' )
			.then( () => {
				const currentIndex = localData[ 'records-list' ];
				expect( currentIndex ).to.eql( [ { key: 'key1', timestamp: now } ] );
				expect( localData ).to.have.property( 'key1', 'test1' );
				expect( localData ).to.have.property( RECORDS_LIST_KEY );
				expect( localData ).to.not.have.property( 'key2' );
			} );
		} );
	} );

	describe( '#clearAll', () => {
		it( 'should clear all sync records and nothing else', () => {
			localData = { test: 1, 'sync-record-test': 2 }
			return cacheIndex.addItem( 'sync-record-test' )
			.then( cacheIndex.clearAll )
			.then( () => {
				expect( localData ).to.eql( { test: 1 } );
			} )
		} );
	} );

	describe( '#clearPageSeries', () => {
		it( 'should clear records with matching pageSeriesKey and leave other records intact', () => {
			const testParams = {
				apiVersion: '1.1',
				method: 'GET',
				path: '/sites/example.wordpress.com/posts',
			};
			const testParamsNextPage = Object.assign( { next_page: 'someValue' }, testParams );
			const pageSeriesKey = generateKey( testParams );
			const now = Date.now();
			localData = { test: 1, test2: 2 }
			setRecordsList( [
				{ key: 'test2', pageSeriesKey: pageSeriesKey, timestamp: now },
				{ key: 'test', timestamp: now },
			] );
			return cacheIndex.clearPageSeries( testParamsNextPage )
			.then( () => {
				expect( localData ).to.eql( { test: 1, [ RECORDS_LIST_KEY ]: [ { key: 'test', timestamp: now } ] } );
			} );
		} );
	} );
} );
