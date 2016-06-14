/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import page from 'page';

/**
 * Internal dependencies
 */
import HeaderCake from 'components/header-cake';
import HostSelect from './host-select';

export default React.createClass( {
	displayName: 'GuidedTransfer',

	propTypes: {
		siteSlug: PropTypes.string.isRequired
	},

	showExporter() {
		page( `/settings/export/${this.props.siteSlug}` );
	},

	render: function() {
		return (
			<div className="guided-transfer">
				<div className="guided-transfer__header-nav">
					<HeaderCake
						onClick={ this.showExporter }
						isCompact={ true }
					>
							{ this.translate( 'Guided Transfer' ) }
					</HeaderCake>
				</div>

				<div className="guided-transfer__content">
					<HostSelect />
				</div>
			</div>
		);
	}
} );
