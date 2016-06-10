/** @ssr-ready **/

/**
 * External dependencies
 */
import get from 'lodash/get';

/**
 * Internal dependencies
 */
import { getSite } from 'state/sites/selectors';
import { getSelectedSiteId } from 'state/selectors';

/**
 * Returns the site object for the currently selected site.
 *
 * @param  {Object}  state  Global state tree
 * @return {?Object}        Selected site
 */
export function getSelectedSite( state ) {
	const siteId = getSelectedSiteId( state );
	if ( ! siteId ) {
		return null;
	}

	return getSite( state, siteId );
}

/**
 * Returns the current section name.
 *
 * @param  {Object}  state Global state tree
 * @return {?String}       Current section name
 */
export function getSectionName( state ) {
	return get( state.ui.section, 'name', null );
}

/**
 * Returns whether a section is loading.
 *
 * @param  {Object}  state Global state tree
 * @return {Boolean}       Whether the section is loading
 */
export function isSectionLoading( state ) {
	return state.ui.isLoading;
}

/**
 * Returns true if the current section is isomorphic.
 *
 * @param  {Object}  state Global state tree
 * @return {bool}    True if current section is isomorphic
 *
 * @see client/sections
 */
export function isSectionIsomorphic( state ) {
	return get( state.ui.section, 'isomorphic', false );
}
