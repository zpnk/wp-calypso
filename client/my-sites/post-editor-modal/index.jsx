/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import sitesGenerator from 'lib/sites-list';
import PostEditor from 'post-editor/post-editor';
import PreferencesData from 'components/data/preferences-data';
import Dialog from 'components/dialog';
import { setEditorPostId } from 'state/ui/editor/actions';
import { editPost } from 'state/posts/actions';
import actions from 'lib/posts/actions';
import {
	setEditingMode,
	startEditingNew,
	EDITING_MODES
} from 'state/ui/editor/post/actions';

const sites = sitesGenerator();

const PostEditorModal = React.createClass( {
	propTypes: {
		dispatch: React.PropTypes.func.isRequired,
		siteId: React.PropTypes.number.isRequired,
		visible: React.PropTypes.bool,
		postType: React.PropTypes.oneOf( [ 'post', 'page' ] ),
	},

	getDefaultProps() {
		return {
			visible: false,
			postType: 'post',
		};
	},

	componentWillMount() {
		this.startEditing();
	},

	startEditing() {
		const site = sites.getSite( this.props.siteId );
		this.props.dispatch( setEditorPostId( null ) );
		this.props.dispatch( editPost( { type: this.props.postType }, site.ID, null ) );

		let postOptions = { type: this.props.postType };
		let titleStrings;
		if ( 'page' === this.props.postType ) {
			titleStrings = {
				edit: this.translate( 'Edit Page', { textOnly: true } ),
				new: this.translate( 'New Page', { textOnly: true } ),
				ga: 'Page'
			};
		} else {
			titleStrings = {
				edit: this.translate( 'Edit Post', { textOnly: true } ),
				new: this.translate( 'New Post', { textOnly: true } ),
				ga: 'Post'
			};
		}
		// TODO: REDUX - remove flux actions when whole post-editor is reduxified
		actions.startEditingNew( site, postOptions );

		this.props.dispatch( setEditingMode( EDITING_MODES.NEW, titleStrings.new, { siteID: site.ID } ) );
		this.props.dispatch( startEditingNew( site, postOptions ) );
	},

	renderContent() {
		return (
			<div className="post-editor-modal">
				<PreferencesData>
					<PostEditor
						sites={ sites }
						type={ this.props.postType }
					/>
				</PreferencesData>
			</div>
		);
	},

	render: function() {
		return (
			<Dialog
				isVisible={ this.props.visible }
				additionalClassNames="editor-media-modal"
				>
				{ this.renderContent() }
			</Dialog>
		);
	}
} );

function mapStateToProps() {
	return {};
}

function mapDispatchToProps( dispatch ) {
	return { dispatch };
}

export default connect( mapStateToProps, mapDispatchToProps )( PostEditorModal );
