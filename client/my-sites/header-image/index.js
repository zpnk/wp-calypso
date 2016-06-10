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

const HeaderImageControl = React.createClass( {
	propTypes: {
		site: React.PropTypes.object.isRequired,
		headerImageUrl: React.PropTypes.string,
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
			this.props.onChange( { headerImageUrl: newImage.URL, headerImagePostId: newImage.ID, headerImageWidth: newImage.width, headerImageHeight: newImage.height } );
		}
	},

	removeCurrentImage() {
		this.props.onChange( { headerImageUrl: null, headerImagePostId: null } );
	},

	render() {
		return (
			<div className="header-image">
				<ImageSelector
					imagePostId={ this.props.headerImagePostId }
					onRemove={ this.removeCurrentImage }
					onSave={ this.setImage }
					label={ this.translate( 'Set Header Image' ) }
					site={ this.props.site }
				/>
			</div>
		);
	}
} );

function mapStateToProps( state, ownProps ) {
	const selectedSite = getSelectedSite( state ) || {}
	const headerImagePostId = ownProps.hasOwnProperty( 'headerImagePostId' ) ? ownProps.headerImagePostId : get( selectedSite, 'options.header_image.attachment_id' );
	const headerImageUrl = ownProps.hasOwnProperty( 'headerImageUrl' ) ? ownProps.headerImageUrl : get( selectedSite, 'options.header_image.url' );
	const headerImageWidth = ownProps.hasOwnProperty( 'headerImageWidth' ) ? ownProps.headerImageWidth : get( selectedSite, 'options.header_image.width' );
	const headerImageHeight = ownProps.hasOwnProperty( 'headerImageHeight' ) ? ownProps.headerImageHeight : get( selectedSite, 'options.header_image.height' );
	return { site: selectedSite, headerImagePostId, headerImageUrl, headerImageWidth, headerImageHeight };
}

export default connect( mapStateToProps )( HeaderImageControl );
