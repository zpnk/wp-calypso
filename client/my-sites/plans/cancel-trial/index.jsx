/**
 * External dependencies
 */
import { connect } from 'react-redux';
import page from 'page';
import React from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import CompactCard from 'components/card/compact';
import { fetchSitePlans } from 'state/sites/plans/actions';
import { getCurrentPlan } from 'lib/plans';
import { getPlansBySiteId } from 'state/sites/plans/selectors';
import HeaderCake from 'components/header-cake';
import Main from 'components/main';

const CancelTrial = React.createClass( {
	componentDidMount: function() {
		this.props.fetchSitePlans( this.props.selectedSite.ID );
	},

	goToPlans() {
		page( `/plans/${ this.props.selectedSite.slug }` );
	},

	render() {
		if ( ! this.props.sitePlans.hasLoadedFromServer ) {
			return null;
		}

		const currentPlan = getCurrentPlan( this.props.sitePlans.data );

		return (
			<Main>
				<HeaderCake onClick={ this.goToPlans }>
					{ this.translate( 'Cancel %(planName)s Trial', {
						args: { planName: currentPlan.productName }
					} ) }
				</HeaderCake>
				<Card className="cancel-trial__content">
					{ this.translate( 'Are you sure you want to cancel your trial of {{strong}}%(planName)s{{/strong}}?', {
						args: { planName: currentPlan.productName },
						components: { strong: <strong /> }
					} ) }
				</Card>
				<CompactCard>
					<Button onClick={ this.cancelTrial }>
						{ this.translate( 'Cancel %(planName)s Trial', {
							args: { planName: currentPlan.productName }
						} ) }
					</Button>
				</CompactCard>
			</Main>
		);
	}
} );

export default connect(
	( state, props ) => {
		return {
			sitePlans: getPlansBySiteId( state, props.selectedSite.ID )
		};
	},
	( dispatch ) => {
		return {
			fetchSitePlans( siteId ) {
				dispatch( fetchSitePlans( siteId ) );
			}
		};
	}
)( CancelTrial );
