/**
 * External dependencis
 */
import { combineReducers } from 'redux';
import pick from 'lodash/pick';

/**
 * Internal dependencies
 */
import {
	JETPACK_SYNC_STATUS_REQUEST,
	JETPACK_SYNC_STATUS_RECEIVED,
	JETPACK_SYNC_STATUS_SUCCESS,
	JETPACK_SYNC_STATUS_ERROR,
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';
import { getExpectedResponseKeys } from './utils';

export function jetpackSync( state = {}, action ) {
	switch ( action.type ) {
		case JETPACK_SYNC_STATUS_REQUEST:
			return Object.assign( {}, state, {
				[ action.siteId ]: { isRequesting: true }
			} );
		case JETPACK_SYNC_STATUS_RECEIVED:
			return Object.assign( {}, state, {
				[ action.siteId ]: { isRequesting: false }
			} );
		case JETPACK_SYNC_STATUS_SUCCESS:
			return Object.assign( {}, state, {
				[ action.siteId ]: Object.assign(
					{
						isRequesting: false,
						error: false
					},
					pick( action.data, getExpectedResponseKeys() )
				)
			} );
		case JETPACK_SYNC_STATUS_ERROR:
			return Object.assign( {}, state, {
				[ action.siteId ]: { isRequest: false, error: action.error }
			} );
		case SERIALIZE:
		case DESERIALIZE:
			return {};
	}
	return state;
}

export default combineReducers( {
	jetpackSync
} );
