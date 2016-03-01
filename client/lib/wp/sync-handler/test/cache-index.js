/**
 * External dependencies
 */
import { expect } from 'chai';
import rewire from 'rewire';
import mockery from 'mockery';
import ms from 'ms';

let cacheIndex, cacheIndexModule, localData, RECORDS_LIST_KEY;

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
		cacheIndexModule = rewire( '../cache-index' );
		cacheIndex = cacheIndexModule.cacheIndex;
		RECORDS_LIST_KEY = cacheIndexModule.__get__( 'RECORDS_LIST_KEY' );
	} );

	after( function() {
		mockery.disable();
	} );

	beforeEach( clearLocal ); // also do inside nested blocks with >1 test

	describe( '#getAll', () => {
		beforeEach( clearLocal );

		it( 'should return empty array for empty localforage', () => {
			cacheIndex.getAll()
			.then( ( res ) => {
				expect( res ).to.equal( null );
			} );
		} );
		it( 'should return index from localforage and nothing else', () => {
			localData = {
				test: 1,
				test2: 2,
			};
			localData[ RECORDS_LIST_KEY ] = 3;
			cacheIndex.getAll()
			.then( ( res ) => {
				expect( res ).to.equal( 3 );
			} );
		} );
	} );

	describe( '#addItem', () => {
		it( 'should add item to empty index', () => {
			cacheIndex.addItem( 'testKey' )
			.then( () => {
				const currentIndex = localData[ 'records-list' ];
				expect( currentIndex ).to.be.an( 'array' );
				expect( currentIndex[0] ).to.have.property( 'key', 'timestamp' );
				expect( currentIndex[0].key ).to.equal( 'testKey' );
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
			cacheIndex.removeItem( 'key2' )
			.then( () => {
				const currentIndex = localData[ 'records-list' ];
				expect( currentIndex ).to.equal( [ { key: 'key1' }, { key: 'key3' } ] );
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
			cacheIndex.pruneRecordsFrom( '1 hour' )
			.then( () => {
				const currentIndex = localData[ 'records-list' ];
				expect( currentIndex ).to.equal( [ { key: 'key1', timestamp: now } ] );
				expect( localData ).to.have.property( 'key1', RECORDS_LIST_KEY );
				expect( localData ).to.not.have.property( 'key2' );
			} );
		} );
	} );

	describe( '#clearAll', () => {
		it( 'should clear all sync records and nothing else', () => {
			localData = { test: 1, 'sync-record-test': 2 }
			cacheIndex.addItem( 'sync-record-test' )
			.then( cacheIndex.clearAll )
			.then( () => {
				expect( localData ).to.equal( { test: 1 } );
			} )
		} );
	} );
} );
