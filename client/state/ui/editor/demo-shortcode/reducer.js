/**
 * External dependencies
 */
import clone from 'lodash/clone';

/**
 * Internal dependencies
 */
 import {
	EDITOR_DEMO_SHORTCODE_CLEAR,
	EDITOR_DEMO_SHORTCODE_UPDATE
 } from 'state/action-types';

const initialState = '[shortcode]hello there![/shortcode]';

export default function( state = initialState, action ) {
	switch ( action.type ) {
		case EDITOR_DEMO_SHORTCODE_CLEAR:
			state = clone( initialState );
			break;
		case EDITOR_DEMO_SHORTCODE_UPDATE:
			state = clone( action.shortcode );
			break;
	}

	return state;
}
