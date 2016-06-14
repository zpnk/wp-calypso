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
		const { translate } = this.props;

		return (
			<div>
				<SectionHeader label={ this.props.translate( 'Set up Guided Transfer' ) } />
				<Card>
					<p>{ translate(
`{{strong}}Please choose{{/strong}} one of our Guided Transfer compatible
{{partner_link}}partner hosts{{/partner_link}}. You must have a hosting account
with one of them to be able to move your site. Visit them {{lobby_link}}Guided
Transfer Lobby{{/lobby_link}} if you have any question before starting, or
{{learn_link}}learn more{{/learn_link}} about the process.`,
						{
							components: {
								strong: <strong />,
								partner_link: <a href="/" />,
								lobby_link: <a href="/" />,
								learn_link: <a href="/" />,
							}
						} ) }
					</p>
					<label>{ translate( 'Select your hosting provider' ) }</label>
				</Card>
			</div>
		);
	}
}

export default localize( HostSelect );
