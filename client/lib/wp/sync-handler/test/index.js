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

let wpcom, SyncHandler, hasPaginationChanged, localData, responseData, clearPageSeries;

const localforageMock = {
	getLocalForage() {
		return {
			setItem: function( key, data ) {
				return new Promise( resolve => {
					localData[ key ] = data;
					resolve();
				} )
			},
			getItem: function( key ) {
				return new Promise( resolve => {
					resolve( localData[ key ] );
				} );
			},
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
		wpcom = new SyncHandler( handlerMock );
	} );
	beforeEach( () => {
		responseData = {};
		localData = {};
	} );
	after( function() {
		mockery.disable();
	} );
	it( 'should call callback with local response', () => {
		const { postListParams, postListLocalRecord, postListResponseBody } = testData;
		const key = generateKey( postListParams );
		const callback = sinon.spy();
		localData[ key ] = postListLocalRecord;
		wpcom( postListParams, callback );
		expect( callback.calledWith( null, postListResponseBody ) );
	} );
	it( 'should call callback with request response', () => {
		const { postListParams, postListResponseBodyFresh } = testData;
		const key = generateKey( postListParams );
		const callback = sinon.spy();
		responseData[ key ] = postListResponseBodyFresh;
		wpcom( postListParams, callback );
		expect( callback ).to.have.been.calledOnce;
		expect( callback.calledWith( null, postListResponseBodyFresh ) );
	} );
	it( 'should call callback twice with local and request responses', () => {
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
		expect( callback ).to.have.been.calledTwice;
		expect( callback.calledWith( null, postListResponseBody ) );
		expect( callback.calledWith( null, postListResponseBodyFresh ) );
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
		before( () => {
			sinon.spy( hasPaginationChanged );
		} );
		beforeEach( () => {
			responseData = {};
			localData = {};
		} );
		it( 'should not call hasPaginationChanged for non-whitelisted requests', () => {
			const { nonWhiteListedRequest } = testData;
			wpcom( nonWhiteListedRequest, () => {} );
			expect( hasPaginationChanged ).not.to.have.been.called;
		} );
		it( 'should call hasPaginationChanged once for whitelisted request', () => {
			const { postListParams } = testData;
			wpcom( postListParams, () => {} );
			expect( hasPaginationChanged ).to.have.been.calledOnce;
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
		it( 'should call clearPageSeries if page handle is different', () => {
			const { postListResponseBody, postListResponseBodyFresh } = testData;
			const clearPageSeriesSpy = sinon.spy( clearPageSeries );
			hasPaginationChanged( postListResponseBody, postListResponseBodyFresh );
			expect( clearPageSeriesSpy ).to.have.been.calledOnce;
		} );
	} );
} );
