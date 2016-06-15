/**
 * External dependencies
 */
import forOwn from 'lodash/forOwn';
import get from 'lodash/get';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import createSelector from 'lib/create-selector';
import {
	getSerializedStatsQuery
} from './utils';

/**
 * Returns true if currently requesting stats for the statType and query combo, or false
 * otherwise.
 *
 * @param  {Object}  state    Global state tree
 * @param  {Number}  siteId   Site ID
 * @param  {String}  statType Type of stat
 * @param  {Object}  query    Stats query object
 * @return {Boolean}          Whether stats are being requested
 */
export function isRequestingSiteStatsForQuery( state, siteId, statType, query ) {
	const serializedQuery = getSerializedStatsQuery( query );
	return !! get( state.stats.lists.requesting, [ siteId, statType, serializedQuery ] );
}

/**
 * Returns object of stats data for the statType and query combo, or null if no stats have been
 * received.
 *
 * @param  {Object}  state    Global state tree
 * @param  {Number}  siteId   Site ID
 * @param  {String}  statType Type of stat
 * @param  {Object}  query    Stats query object
 * @return {?Object}           Data for the query
 */
export function getSiteStatsForQuery( state, siteId, statType, query ) {
	const serializedQuery = getSerializedStatsQuery( query );
	return get( state.stats.lists.items, [ siteId, statType, serializedQuery ], null );
}

/**
 * Returns a parsed object of statsStreak data for a given query, or default "empty" object
 * if no statsStreak data has been received for that site.
 *
 * @param  {Object}  state    Global state tree
 * @param  {Number}  siteId   Site ID
 * @param  {Object}  query    Stats query object
 * @return {Object}           Parsed Data for the query
 */
export const getSiteStatsPostStreakData = createSelector(
	( state, siteId, query ) => {
		const response = {};
		const streakData = getSiteStatsForQuery( state, siteId, 'statsStreak', query );

		if ( streakData && streakData.data ) {
			Object.keys( streakData.data ).forEach( ( timestamp ) => {
				const postDay = i18n.moment.unix( timestamp );
				const datestamp = postDay.format( 'YYYY-MM-DD' );
				if ( 'undefined' === typeof( response[ datestamp ] ) ) {
					response[ datestamp ] = 0;
				}

				response[ datestamp ] += streakData.data[ timestamp ];
			} );
		}

		return response;
	},
	( state, siteId, query ) => getSiteStatsForQuery( state, siteId, 'statsStreak', query ),
	( state, siteId, query ) => {
		const serializedQuery = getSerializedStatsQuery( query );
		return [ siteId, 'statsStreak', serializedQuery ].join();
	}
);

/**
 * Returns a number representing the most posts made during a day for a given query
 *
 * @param  {Object}  state    Global state tree
 * @param  {Number}  siteId   Site ID
 * @param  {Object}  query    Stats query object
 * @return {?Number}          Max number of posts by day
 */
export const getSiteStatsMaxPostsByDay = createSelector(
	( state, siteId, query ) => {
		let max = 0;

		forOwn( getSiteStatsPostStreakData( state, siteId, query ), count => {
			if ( count > max ) {
				max = count;
			}
		} );

		return max || null;
	},
	( state, siteId, query ) => getSiteStatsForQuery( state, siteId, 'statsStreak', query ),
	( state, siteId, query ) => {
		const serializedQuery = getSerializedStatsQuery( query );
		return [ siteId, 'statsStreakMax', serializedQuery ].join();
	}
);

/**
 * Returns a number representing the posts made during a day for a given query
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @param  {Object}  query  Stats query object
 * @param  {String}  date   Date in YYYY-MM-DD format
 * @return {?Number}        Number of posts made on date
 */
export function getSiteStatsPostsCountByDay( state, siteId, query, date ) {
	const data = getSiteStatsPostStreakData( state, siteId, query );
	return data[ date ] || null;
}

/**
 * Returns a parsed object of statsInsights data for a given site, or default "empty" object
 * if no statsStreak data has been received for that site.
 *
 * @param  {Object}  state    Global state tree
 * @param  {Number}  siteId   Site ID
 * @return {Object}           Parsed Insights Data
 */
export const getSiteStatsInsightsData = createSelector(
	( state, siteId ) => {
		const response = {};
		const insightsData = getSiteStatsForQuery( state, siteId, 'statsInsights', {} );

		if ( insightsData &&
			( insightsData.highest_day_of_week || 0 === insightsData.highest_day_of_week )
		) {
			const { highest_hour, highest_day_percent, highest_day_of_week, highest_hour_percent } = insightsData;

			// Adjust Day of Week from 0 = Monday to 0 = Sunday (for Moment)
			let dayOfWeek = highest_day_of_week + 1;
			if ( dayOfWeek > 6 ) {
				dayOfWeek = 0;
			}

			response.day = i18n.moment().day( dayOfWeek ).format( 'dddd' );
			response.percent = Math.round( highest_day_percent );
			response.hour = i18n.moment().hour( highest_hour ).startOf( 'hour' ).format( 'LT' );
			response.hour_percent = Math.round( highest_hour_percent );
		}

		return response;
	},
	( state, siteId ) => getSiteStatsForQuery( state, siteId, 'statsInsights', {} ),
	( state, siteId ) => {
		return [ siteId, 'statsInsights' ].join();
	}
);

