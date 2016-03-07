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

let wpcom, SyncHandler, hasPaginationChanged, localData, responseData;

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
		const key = generateKey( testData.postListParams );
		const callback = sinon.spy();
		localData[ key ] = testData.postListLocalRecord;
		wpcom( testData.postListParams, callback );
		expect( callback.calledWith( null, testData.postListResponseBody ) );
	} );

	it( 'should call callback with request response', () => {
		const key = generateKey( testData.postListParams );
		const callback = sinon.spy();
		responseData[ key ] = testData.postListResponseBodyFresh;
		wpcom( testData.postListParams, callback );
		expect( callback ).to.have.been.calledOnce;
		expect( callback.calledWith( null, testData.postListResponseBodyFresh ) );
	} );

	it( 'should call callback twice with local and request responses', () => {
		const key = generateKey( testData.postListParams );
		const callback = sinon.spy();
		localData[ key ] = testData.postListLocalRecord;
		responseData[ key ] = testData.postListResponseBodyFresh;
		wpcom( testData.postListParams, callback );
		expect( callback ).to.have.been.calledTwice;
		expect( callback.calledWith( null, testData.postListResponseBody ) );
		expect( callback.calledWith( null, testData.postListResponseBodyFresh ) );
	} );

	describe( 'generateKey', () => {
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
	} );

	describe( 'hasPaginationChanged', () => {
		before( () => {
			sinon.spy( hasPaginationChanged );
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
		} )
		it( 'should return true call with empty local response', () => {
			const { postListResponseBody } = testData;
			const result = hasPaginationChanged( postListResponseBody, null );
			expect( result ).to.equal( true );
		} )
	} );
} );
