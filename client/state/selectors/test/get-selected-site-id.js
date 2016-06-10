/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/selectors';

describe( 'getSelectedSiteId()', () => {
	it( 'should return null if no site is selected', () => {
		const selected = getSelectedSiteId( {
			ui: {
				selectedSiteId: null
			}
		} );

		expect( selected ).to.be.null;
	} );

	it( 'should return ID for the selected site', () => {
		const selected = getSelectedSiteId( {
			ui: {
				selectedSiteId: 2916284
			}
		} );

		expect( selected ).to.eql( 2916284 );
	} );
} );
