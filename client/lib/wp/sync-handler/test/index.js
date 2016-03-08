/**
 * External dependencies
 */
import { expect } from 'chai';
import sinon from 'sinon';
import mockery from 'mockery';

/**
 * Internal dependencies
 */
import { generateKey } from '../utils';
import * as testData from './data';
import { RECORDS_LIST_KEY } from '../constants';

let wpcom, SyncHandler, hasPaginationChanged, hasPaginationChangedSpy, localData, responseData, clearPageSeries;

const localforageMock = {
	getLocalForage() {
		return {
			setItem( key, data ) {
				console.log( 'setItem:', key );
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

describe( 'sync-handler', () => {
	before( () => {
		mockery.enable( {
			warnOnReplace: false,
			warnOnUnregistered: false
		} );
		mockery.registerMock( 'lib/localforage', localforageMock );
		const handlerMock = ( params, callback ) => {
			const key = generateKey( params );
			callback( null, responseData[ key ] );
			return responseData[ key ];
		};
		( { SyncHandler, hasPaginationChanged } = require( '../' ) );
		( { clearPageSeries } = require( '../cache-index' ) );
		hasPaginationChangedSpy = sinon.spy( hasPaginationChanged );
		wpcom = new SyncHandler( handlerMock );
	} );
	beforeEach( () => {
		responseData = {};
		localData = {};
	} );
	after( function() {
		mockery.disable();
	} );
	it( 'should call callback with local response', ( done ) => {
		const { postListParams, postListLocalRecord, postListResponseBody } = testData;
		const key = generateKey( postListParams );
		const callback = sinon.spy();
		localData[ key ] = postListLocalRecord;
		wpcom( postListParams, callback )
		setTimeout( () => {
			expect( callback.calledWith( null, postListResponseBody ) ).to.be.true;
			done();
		}, 0 );
	} );
	it( 'should call callback with request response', ( done ) => {
		const { postListParams, postListResponseBodyFresh } = testData;
		const key = generateKey( postListParams );
		const callback = sinon.spy();
		responseData[ key ] = postListResponseBodyFresh;
		wpcom( postListParams, callback );
		setTimeout( () => {
			expect( callback ).to.have.been.calledOnce;
			expect( callback.calledWith( null, postListResponseBodyFresh ) ).to.be.true;
			done();
		}, 0 );
	} );
	it( 'should call callback twice with local and request responses', ( done ) => {
		const {
			postListParams,
			postListLocalRecord,
			postListResponseBody,
			postListResponseBodyFresh
		} = testData;
		const key = generateKey( postListParams );
		const callback = sinon.spy();
		localData[ key ] = postListLocalRecord;
		responseData[ key ] = postListResponseBodyFresh;
		wpcom( postListParams, callback );
		setTimeout( () => {
			expect( callback ).to.have.been.calledTwice;
			expect( callback.calledWith( null, postListResponseBody ) ).to.be.true;
			expect( callback.calledWith( null, postListResponseBodyFresh ) ).to.be.true;
			done();
		}, 0 );
	} );
	it( 'should store cacheIndex records with matching pageSeriesKey for paginated responses', ( done ) => {
		const {
			postListParams,
			postListParamsNextPage,
			postListResponseBody,
			postListResponseBodyPageTwo,
		} = testData;
		const pageOneKey = generateKey( postListParams );
		const pageTwoKey = generateKey( postListParamsNextPage );
		responseData = {
			[ pageOneKey ]: postListResponseBody,
			[ pageTwoKey ]: postListResponseBodyPageTwo,
		};
		wpcom( postListParams, () => {} );
		wpcom( postListParamsNextPage, () => {} );
		setTimeout( () => {
			// console.log( Object.keys( localData ) );
			const recordsList = localData[ RECORDS_LIST_KEY ];
			console.log('===');
			console.log( Object.keys( localData ) );
			console.log('===');
			expect( pageOneKey ).to.not.equal( pageTwoKey );
			expect( recordsList[0].pageSeriesKey ).to.equal( recordsList[1].pageSeriesKey );
			done();
		}, 100 );
	} );
	it.skip( 'should call clearPageSeries if page handle is different', () => {
		const { postListParams, postListResponseBody, postListResponseBodyFresh } = testData;
		const clearPageSeriesSpy = sinon.spy( clearPageSeries );
		hasPaginationChanged( postListResponseBody, postListResponseBodyFresh );
		expect( clearPageSeriesSpy ).to.have.been.calledOnce;
		expect( clearPageSeriesSpy.calledWith( postListParams ) );
	} );

	describe( 'generateKey', () => {
		beforeEach( () => {
			responseData = {};
			localData = {};
		} );
		it( 'should return the same key for identical request', () => {
			const { postListParams } = testData;
			const secondRequest = Object.assign( {}, postListParams );
			const key1 = generateKey( postListParams );
			const key2 = generateKey( secondRequest );
			expect( typeof key1 ).to.equal( 'string' );
			expect( key1 ).to.equal( key2 );
		} );
		it( 'should return unique keys for different requests', () => {
			const { postListParams } = testData;
			const secondRequest = Object.assign( {}, postListParams, { query: '?filter=test' } );
			const key1 = generateKey( postListParams );
			const key2 = generateKey( secondRequest );
			expect( typeof key1 ).to.equal( 'string' );
			expect( key1 ).to.not.equal( key2 );
		} );
		it( 'should return the same key if parameters are in different order', () => {
			const { postListParams, postListParamsDifferentOrder } = testData;
			const key1 = generateKey( postListParams );
			const key2 = generateKey( postListParamsDifferentOrder );
			expect( typeof key1 ).to.equal( 'string' );
			expect( key1 ).to.equal( key2 );
		} );
	} );

	describe( 'hasPaginationChanged', () => {
		beforeEach( () => {
			responseData = {};
			localData = {};
		} );
		afterEach( () => {
			hasPaginationChangedSpy.reset();
		} );
		it( 'should not call hasPaginationChanged for non-whitelisted requests', ( done ) => {
			const { nonWhiteListedRequest, nonWhiteListedResponse } = testData;
			const key = generateKey( nonWhiteListedRequest );
			responseData[ key ] = nonWhiteListedResponse;
			wpcom( nonWhiteListedRequest, () => {} );
			setTimeout( () => {
				expect( hasPaginationChangedSpy.called ).to.be.false;
				done();
			}, 0 );
		} );
		it( 'should call hasPaginationChanged once for whitelisted request', ( done ) => {
			const { postListParams, postListResponseBody } = testData;
			const key = generateKey( postListParams );
			responseData[ key ] = postListResponseBody;
			wpcom( postListParams, () => {} );
			setTimeout( () => {
				expect( hasPaginationChangedSpy.called ).to.be.true;
				done();
			}, 500 );
		} );
		it( 'should return false if requestResponse has no page handle', () => {
			const { postListResponseBodyNoHandle } = testData;
			const result = hasPaginationChanged( postListResponseBodyNoHandle, null );
			expect( result ).to.equal( false );
		} );
		it( 'should return false for call with identical response', () => {
			const { postListResponseBody } = testData;
			const identicalResponse = Object.assign( {}, postListResponseBody );
			const result = hasPaginationChanged( postListResponseBody, identicalResponse );
			expect( result ).to.equal( false );
		} );
		it( 'should return true if page handle is different', () => {
			const { postListResponseBody, postListResponseBodyFresh } = testData;
			const result = hasPaginationChanged( postListResponseBody, postListResponseBodyFresh );
			expect( result ).to.equal( true );
		} );
		it( 'should return false with empty local response', () => {
			const { postListResponseBody } = testData;
			const result = hasPaginationChanged( postListResponseBody, null );
			expect( result ).to.equal( false );
		} );
	} );
} );
