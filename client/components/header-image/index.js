/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import ImageSelector from 'components/image-selector';

const HeaderImageControl = React.createClass( {
	propTypes: {
		site: React.PropTypes.object.isRequired,
		headerImageUrl: React.PropTypes.string,
		headerImagePostId: React.PropTypes.number,
		onChange: React.PropTypes.func.isRequired,
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
			<div className="design-menu-controls__control design-menu-controls__header-image-control">
				<ImageSelector
					imagePostId={ this.props.headerImagePostId }
					onRemove={ this.removeCurrentImage }
					onSave={ this.setImage }
					label={ this.translate( 'Set Header Image' ) }
					site={ this.props.site } />
			</div>
		);
	}
} );

export default HeaderImageControl;
