/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { CONNECTION_LOST, CONNECTION_RESTORED, CONNECTION_INIT } from 'state/action-types';

export function isOnline( state = 'CHECKING', action ) {
	if (
		action.type === CONNECTION_LOST ||
		( action.type === CONNECTION_INIT && !action.isOnline )
	) {
		state = 'OFFLINE';
	} else if (
		action.type === CONNECTION_RESTORED ||
		( action.type === CONNECTION_INIT && action.isOnline )
	) {
		state = 'ONLINE';
	}

	return state;
}

export default combineReducers( {
	isOnline
} );
