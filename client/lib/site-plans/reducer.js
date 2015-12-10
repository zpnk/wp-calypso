/**
 * External dependencies
 */
import React from 'react/addons';

/**
 * Internal dependencies
 */
import { action as ActionTypes } from 'lib/upgrades/constants';

function updateStateForSite( state, siteId, data ) {
	const command = state[ siteId ] ? '$merge' : '$set';

	return React.addons.update( state, {
		[ siteId ]: {
			[ command ]: data
		}
	} );
}

function getInitialStateForSite() {
	return {
		currentPlan: false,
		expiry: null,
		expiryMoment: null,
		formattedDiscount: null,
		formattedPrice: null,
		freeTrial: null,
		id: null,
		productName: null,
		productSlug: null,
		rawDiscount: null,
		rawPrice: null,
		subscribedDate: null,
		subscribedMoment: null,
		userFacingExpiry: null,
		userFacingExpiryMoment: null
	}
}

function reducer( state, payload ) {
	const { action } = payload;

	switch ( action.type ) {
		case ActionTypes.UPDATE_SITE_PLANS_DETAILS:
			state = updateStateForSite( state, action.siteId, action.planDetails );

			break;
	}

	return state;
}

export {
	getInitialStateForSite,
	reducer
};
