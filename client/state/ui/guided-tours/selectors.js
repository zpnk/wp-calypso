/**
 * External dependencies
 */
import get from 'lodash/get';
import memoize from 'lodash/memoize';
import startsWith from 'lodash/startsWith';

/**
 * Internal dependencies
 */
import { isSectionLoading } from 'state/ui/selectors';
import createSelector from 'lib/create-selector';
import guidedToursConfig from 'layout/guided-tours/config';

const getToursConfig = memoize( ( tour ) => guidedToursConfig.get( tour ) );

/**
 * Returns the current state for Guided Tours.
 *
 * This includes the raw state from state/ui/guidedTour, but also the available
 * configuration (`stepConfig`) for the currently active tour step, if one is
 * active.
 *
 * @param  {Object}  state Global state tree
 * @return {Object}        Current Guided Tours state
 */
const getRawGuidedTourState = state => get( state, 'ui.guidedTour', false );

const getTourTriggers = state => get( state, 'ui.tourTriggers', [] );

const tourCandidates = [
	{
		name: 'themes',
		test: ( { type, path } ) =>
			type === 'SET_ROUTE' && startsWith( path, '/design' ),
	},
];

const findEligibleTour = createSelector(
		state => {
			let allTours = guidedToursConfig.getAll();
			allTours = Object.keys( allTours ).map( ( key ) => {
				const tour = allTours[ key ];
				return {
					name: key,
					...tour,
				};
			} );
			console.log( allTours );
			let tourName = false;

			allTours.some( ( tour ) => {
				console.log( 'testing tour: ', tour );
				if ( tour.showInContext( state ) ) {
					tourName = tour.name;
					return true;
				}
			} );
			return tourName;
		},
		state => [
			getTourTriggers( state ),
		]
);

export const getGuidedTourState = createSelector(
	state => {
		const tourState = getRawGuidedTourState( state );
		const { stepName = '' } = tourState;
		let { shouldReallyShow, tour } = tourState;

		if ( ! tour ) {
			console.log( 'no tour, finding one' );
			tour = findEligibleTour( state );
			console.log( 'found', tour );
		}

		if ( tour ) {
			shouldReallyShow = true;
		} else {
			console.log( 'no tour -- returning early' );
			return tourState;
		}

		const tourConfig = getToursConfig( tour );
		const stepConfig = tourConfig[ stepName ] || false;
		const nextStepConfig = getToursConfig( tour )[ stepConfig.next ] || false;

		const shouldShow = !! (
			! isSectionLoading( state ) &&
			shouldReallyShow
		);

		console.log( 'shouldShow, tour', shouldShow, tour );

		/*
			so we get a tour, but only *after* this snippet below in boot has run
			(also we use the query string there)
			it's probably bad form and / or impossible anywhere to dispatch the action
			directly from here I suppose?
		*/
		// if ( config.isEnabled( 'guided-tours' ) && tour && ! context.query.s ) {
		// 	context.store.dispatch( showGuidedTour( {
		// 		shouldShow: true,
		// 		shouldDelay: /^\/(checkout|plans\/select)/.test( path ),
		// 		tour: context.query.tour,
		// 	} ) );
		// }

		return Object.assign( {}, tourState, {
			stepConfig,
			nextStepConfig,
			shouldShow,
			tour,
		} );
	},
	state => [
		getRawGuidedTourState( state ),
		isSectionLoading( state ),
		getTourTriggers( state ),
	]
);
