/**
 * External dependencies
 */
import React from 'react';
import PureRenderMixin from 'react-pure-render/mixin';

/**
 * Internal dependencies
 */
import PlanFeatures from '../';
import { PLAN_FREE, PLAN_PREMIUM, PLAN_BUSINESS } from 'lib/plans/constants';
import QueryPlans from 'components/data/query-plans';

export default React.createClass( {

	displayName: 'PlanFeatures',

	mixins: [ PureRenderMixin ],

	render() {
		return (
			<div className="design-assets__group">
				<h2>
					<a href="/devdocs/app-components/plan-features">Plan Features</a>
				</h2>
				<QueryPlans />
				<PlanFeatures plan={ PLAN_FREE } /* onClick={ this.upgradePlan } */ />
				<PlanFeatures plan={ PLAN_PREMIUM } /* onClick={ this.upgradePlan } */ />
				<PlanFeatures plan={ PLAN_BUSINESS } /* onClick={ this.upgradePlan } */ />
			</div>
		);
	}
} );
