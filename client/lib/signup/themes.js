/**
 * External dependencies
 */
import includes from 'lodash/includes';
import sampleSize from 'lodash/sampleSize';

/**
 * Internal dependencies
 */
import { abtest } from 'lib/abtest';
import { themes } from 'lib/signup/themes-data';

function getUnusedThemes( themeSet, themePool, quantity ) {
	const themeSetSlugs = themeSet.map( theme => theme.slug );
	const filterBySlug = theme => ! includes( themeSetSlugs, theme.slug );
	const availableThemes = themePool.filter( filterBySlug );
	return sampleSize( availableThemes, quantity );
}

export function getDefaultThemes() {
	const filterByDefault = theme => theme.fallback;
	return themes.filter( filterByDefault );
}

export default function getThemes( vertical, designType, quantity = 9 ) {
	const filterByType = theme => theme.design === designType;
	const filterByVertical = theme => includes( theme.verticals, vertical );
	const themesByType = themes.filter( filterByType );
	let themeSet = themesByType;

	// We don't even have design type matches, so just use whatever default themes.
	if ( themeSet.length === 0 ) {
		return sampleSize( getDefaultThemes(), quantity );
	}

	// Apply the vertical filter for test participants.
	if ( 'verticalThemes' === abtest( 'verticalThemes' ) ) {
		themeSet = themeSet.filter( filterByVertical );
	}

	// Make sure we meet the minimum number of themes by adding back in random design type matches.
	if ( themeSet.length < quantity ) {
		themeSet = themeSet.concat( getUnusedThemes( themeSet, themesByType, quantity - themeSet.length ) );
	}

	return sampleSize( themeSet, quantity );
}
