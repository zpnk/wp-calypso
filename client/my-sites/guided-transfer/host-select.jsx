/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import SectionHeader from 'components/section-header';

class HostSelect extends Component {
	render() {
		return (
			<div>
				<SectionHeader label={ this.props.translate( 'Set up Guided Transfer' ) } />
				<Card>
					Content
				</Card>
			</div>
		);
	}
}

export default localize( HostSelect );
