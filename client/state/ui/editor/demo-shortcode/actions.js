/**
 * Internal dependencies
 */
import {
	EDITOR_DEMO_SHORTCODE_CLEAR,
	EDITOR_DEMO_SHORTCODE_UPDATE
} from 'state/action-types';

export function shortcodeClear() {
	return {
		type: EDITOR_DEMO_SHORTCODE_CLEAR
	};
}

export function shortcodeUpdate( shortcode ) {
	return {
		type: EDITOR_DEMO_SHORTCODE_UPDATE,
		shortcode
	};
}
