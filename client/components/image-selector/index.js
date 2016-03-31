/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
// import FormFieldset from 'components/forms/form-fieldset';
// import FormLabel from 'components/forms/form-label';
// import ImagePreloader from 'components/image-preloader';
// import Button from 'components/button';
import MediaLibrarySelectedData from 'components/data/media-library-selected-data';
import EditorMediaModal from 'post-editor/media-modal';
import EditorDrawerWell from 'post-editor/editor-drawer-well';
import EditorFeaturedImagePreviewContainer from './preview-container';

const HeaderImageControl = React.createClass( {
	// propTypes: {
	// 	site: React.PropTypes.object.isRequired,
	// 	headerImageUrl: React.PropTypes.string,
	// 	onChange: React.PropTypes.func.isRequired,
	// },

	getInitialState() {
		return {
			isShowingMedia: false,
		};
	},

	removeCurrentImage() {
		this.props.onChange( { headerImageUrl: null, headerImagePostId: null } );
	},

	openMediaModal() {
		this.setState( { isShowingMedia: true } );
	},

	closeMediaModal() {
		this.setState( { isShowingMedia: false } );
	},

	setImage( selectedItems ) {
		if ( selectedItems && selectedItems.length ) {
			const newImage = selectedItems[0];
			this.props.onChange( { headerImageUrl: newImage.URL, headerImagePostId: newImage.ID, headerImageWidth: newImage.width, headerImageHeight: newImage.height } );
		}
		this.setState( { isShowingMedia: false } );
	},

	renderCurrentImage: function() {
		if ( ! this.props.site || ! this.props.headerImagePostId ) {
			return;
		}

		return (
			<EditorFeaturedImagePreviewContainer
				siteId={ this.props.site.ID }
				itemId={ this.props.headerImagePostId } />
		);
	},

	renderMediaModal() {
		return (
			<MediaLibrarySelectedData siteId={ this.props.site.ID }>
				<EditorMediaModal
					visible={ this.state.isShowingMedia }
					onClose={ this.setImage }
					site={ this.props.site }
					labels={ { confirm: this.translate( 'Set Header Image' ) } }
					enabledFilters={ [ 'images' ] }
					single />
			</MediaLibrarySelectedData>
		);
	},

	render() {
		return (
			<div className="design-menu-controls__control design-menu-controls__header-image-control">
				{ this.renderMediaModal() }
				<EditorDrawerWell
					onClick={ this.openMediaModal }
					onRemove={ this.removeCurrentImage }
					icon="image"
					label={ this.translate( 'Set Header Image' ) }>
					{ this.renderCurrentImage() }
				</EditorDrawerWell>
			</div>
		);
	}
} );

export default HeaderImageControl;
