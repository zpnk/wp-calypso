/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import { getSelectedSite } from 'state/ui/selectors';
import ImageSelector from 'components/image-selector';

const SiteLogoControl = React.createClass( {
	propTypes: {
		site: React.PropTypes.object.isRequired,
		logoUrl: React.PropTypes.string,
		logoPostId: React.PropTypes.number,
		onChange: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			onChange: noop,
		}
	},

	setImage( selectedItems ) {
		if ( selectedItems && selectedItems.length ) {
			const newImage = selectedItems[0];
			this.props.onChange( { logoUrl: newImage.URL, logoPostId: newImage.ID } );
		}
	},

	removeCurrentImage() {
		this.props.onChange( { logoUrl: null, logoPostId: null } );
	},

	render() {
		return (
			<div className="site-logo">
			<ImageSelector
			imagePostId={ this.props.logoPostId }
			onRemove={ this.removeCurrentImage }
			onSave={ this.setImage }
			label={ this.translate( 'Set Site Logo' ) }
			site={ this.props.site } />
			</div>
		);
	}
} );

function mapStateToProps( state, ownProps ) {
	const site = getSelectedSite( state ) || {}
	const logoPostId = ownProps.hasOwnProperty( 'logoPostId' ) ? ownProps.logoPostId : get( site, 'logo.id' );
	const logoUrl = ownProps.hasOwnProperty( 'logoUrl ' ) ? ownProps.logoUrl : get( site, 'logo.url' );
	return { site, logoPostId, logoUrl };
}

export default connect( mapStateToProps )( SiteLogoControl );
