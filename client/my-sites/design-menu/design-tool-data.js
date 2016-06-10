/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import assign from 'lodash/assign';
import { bindActionCreators } from 'redux';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';
import passToChildren from 'lib/react-pass-to-children';
import * as PreviewActions from 'state/preview/actions';

const debug = debugFactory( 'calypso:design-tool-data' );

const DesignToolData = React.createClass( {
	propTypes: {
		// This is the key for the customizations in the Redux store (under preview)
		previewDataKey: React.PropTypes.string.isRequired,
		// These are provided by the connect method
		actions: React.PropTypes.object.isRequired,
		customizations: React.PropTypes.object,
		selectedSite: React.PropTypes.object,
	},

	buildOnChangeFor( id ) {
		return customizations => {
			debug( 'changing customizations for', id );
			const newCustomizations = assign( {}, this.props.customizations, { [ id ]: assign( {}, this.props.customizations[ id ], customizations ) } );
			debug( 'changed customizations to', newCustomizations );
			return this.props.actions.updateCustomizations( this.props.selectedSite.ID, newCustomizations );
		}
	},

	getDefaultChildProps() {
		return {
			onChange: this.buildOnChangeFor( this.props.previewDataKey ),
		};
	},

	getChildProps() {
		if ( this.props.customizations && this.props.customizations[ this.props.previewDataKey ] ) {
			return assign( {}, this.props.customizations[ this.props.previewDataKey ], this.getDefaultChildProps() );
		}
		return this.getDefaultChildProps();
	},

	render() {
		return passToChildren( this, this.getChildProps() );
	}
} );

function mapStateToProps( state ) {
	if ( ! state.preview ) {
		return {};
	}
	const siteId = getSelectedSiteId( state );
	if ( ! state.preview[ siteId ] ) {
		return {};
	}
	const selectedSite = getSelectedSite( state );
	const customizations = state.preview[ siteId ].customizations;
	return { customizations, selectedSite };
}

function mapDispatchToProps( dispatch ) {
	return {
		actions: bindActionCreators( PreviewActions, dispatch ),
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( DesignToolData );
