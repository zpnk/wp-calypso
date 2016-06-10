/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import assign from 'lodash/assign';
import page from 'page';

/**
 * Internal dependencies
 */
import Site from 'my-sites/site';
import Card from 'components/card';
import Button from 'components/button';
import Gridicon from 'components/gridicon';
import * as PreviewActions from 'state/preview/actions';
import accept from 'lib/accept';
import DesignToolData from 'my-sites/design-menu/design-tool-data';
import DesignToolList from 'my-sites/design-tool-list';
import SiteTitleControl from 'my-sites/site-title';
import HeaderImageControl from 'my-sites/header-image';
import HomePageSettings from 'my-sites/home-page-settings';
import SiteLogoControl from 'my-sites/site-logo';
import DesignMenuPanel from 'my-sites/design-menu-panel';

const DesignMenu = React.createClass( {

	propTypes: {
		// These are provided by the connect method
		state: React.PropTypes.object.isRequired,
		isUnsaved: React.PropTypes.bool,
		customizations: React.PropTypes.object,
		selectedSite: React.PropTypes.object.isRequired,
		actions: React.PropTypes.object.isRequired,
	},

	getDefaultProps() {
		return {
			isUnsaved: false,
			customizations: {},
		};
	},

	getInitialState() {
		return {
			activeDesignToolId: null,
		};
	},

	componentWillMount() {
		this.props.actions.clearCustomizations( this.props.selectedSite.ID );
		// Fetch the preview
		this.props.actions.fetchPreviewMarkup( this.props.selectedSite.ID, '' );
	},

	activateDesignTool( activeDesignToolId ) {
		this.setState( { activeDesignToolId } );
	},

	activateDefaultDesignTool() {
		this.setState( { activeDesignToolId: null } );
	},

	onSave() {
		this.props.actions.saveCustomizations();
	},

	onBack() {
		if ( this.state.activeDesignToolId ) {
			return this.activateDefaultDesignTool();
		}
		this.maybeCloseDesignMenu();
	},

	maybeCloseDesignMenu() {
		if ( this.props.isUnsaved ) {
			return accept( this.translate( 'You have unsaved changes. Are you sure you want to close the preview?' ), accepted => {
				if ( accepted ) {
					this.props.actions.clearCustomizations( this.props.selectedSite.ID );
					this.closeDesignMenu();
				}
			} );
		}
		this.props.actions.clearCustomizations( this.props.selectedSite.ID );
		this.closeDesignMenu();
	},

	closeDesignMenu() {
		const siteSlug = this.props.selectedSite.URL.replace( /^https?:\/\//, '' );
		page( `/stats/${siteSlug}` );
		// TODO: go where?
	},

	renderActiveDesignTool() {
		switch ( this.state.activeDesignToolId ) {
			case 'siteTitle':
				return (
					<DesignMenuPanel label={ this.translate( 'Title and Tagline' ) }>
						<DesignToolData previewDataKey={ this.state.activeDesignToolId } >
							<SiteTitleControl />
						</DesignToolData>
					</DesignMenuPanel>
				);
			case 'siteLogo':
				return (
					<DesignMenuPanel label={ this.translate( 'Logo' ) }>
						<DesignToolData previewDataKey={ this.state.activeDesignToolId } >
							<SiteLogoControl />
						</DesignToolData>
					</DesignMenuPanel>
				);
			case 'headerImage':
				return (
					<DesignMenuPanel label={ this.translate( 'Header Image' ) }>
						<DesignToolData previewDataKey={ this.state.activeDesignToolId } >
							<HeaderImageControl />
						</DesignToolData>
					</DesignMenuPanel>
				);
			case 'homePage':
				return (
					<DesignMenuPanel label={ this.translate( 'Homepage Settings' ) }>
						<DesignToolData previewDataKey={ this.state.activeDesignToolId } >
							<HomePageSettings />
						</DesignToolData>
					</DesignMenuPanel>
				);
			default:
				return <DesignToolList onChange={ this.activateDesignTool } />;
		}
	},

	renderSiteCard() {
		// The site object required by Site isn't quite the same as the one in the
		// Redux store, so we patch it.
		const site = assign( {}, this.props.selectedSite, {
			title: this.props.selectedSite.name,
			domain: this.props.selectedSite.URL.replace( /^https?:\/\//, '' ),
		} );
		return <Site site={ site } />;
	},

	render() {
		const saveButtonText = ! this.props.isUnsaved ? this.translate( 'Saved' ) : this.translate( 'Publish Changes' );
		return (
			<div className="design-menu">
				<span className="current-site__switch-sites">
					<Button compact borderless onClick={ this.onBack }>
						<Gridicon icon="arrow-left" size={ 18 } />
						{ this.translate( 'Back' ) }
					</Button>
					{ this.renderSiteCard() }
					<Card className="design-menu__header-buttons">
						<Button primary compact disabled={ ! this.props.isUnsaved } className="design-menu__save" onClick={ this.onSave } >{ saveButtonText }</Button>
					</Card>
				</span>
				{ this.renderActiveDesignTool() }
			</div>
		);
	}
} );

function mapStateToProps( state ) {
	const siteId = state.ui.selectedSiteId;
	const selectedSite = state.sites.items[ siteId ] || {};
	if ( ! state.preview || ! state.preview[ siteId ] ) {
		return { state, selectedSite };
	}
	return { state, selectedSite, customizations: state.preview[ siteId ].customizations, isUnsaved: state.preview[ siteId ].isUnsaved };
}

function mapDispatchToProps( dispatch ) {
	return {
		actions: bindActionCreators( PreviewActions, dispatch ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( DesignMenu );
