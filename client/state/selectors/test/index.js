/**
 * External dependencies
 */
import { expect } from 'chai';
import kebabCase from 'lodash/kebabCase';
import each from 'lodash/each';

/**
 * Internal dependencies
 */
import * as selectors from '../';

describe( 'selectors', () => {
	it( 'should match every selector to its default export', () => {
		each( selectors, ( selector, key ) => {
			expect( require( '../' + kebabCase( key ) ) ).to.equal( selector );
		} );
	} );
} );
