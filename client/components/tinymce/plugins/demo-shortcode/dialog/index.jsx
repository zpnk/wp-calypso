/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import FormButton from 'components/forms/form-button';

const DemoShortcodeDialog = React.createClass( {
	displayName: 'DemoShortcodeDialog',

	propTypes: {
		demoShortcode: PropTypes.string.isRequired,
		showDialog: PropTypes.bool.isRequired,
		isEdit: PropTypes.bool.isRequired,
		onInsert: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired
	},

	render() {
		const {
			demoShortcode,
			isEdit,
			showDialog,
			onInsert,
			onClose
		} = this.props;

		const actionButtons = [
			<FormButton
				key="save"
				onClick={ onInsert } >
				{ isEdit ? this.translate( 'Update' ) : this.translate( 'Insert' ) }
			</FormButton>,
			<FormButton
				key="cancel"
				isPrimary={ false }
				onClick={ onClose } >
				{ this.translate( 'Cancel' ) }
			</FormButton>
		];

		return (
			<Dialog
				isVisible={ showDialog }
				onClose={ onClose }
				buttons={ actionButtons } >
				<p>here goes nothing</p>
				<p>{ demoShortcode }</p>
			</Dialog>
		);
	}
} );

export default connect( state => {
	return {
		demoShortcode: state.ui.editor.demoShortcode
	};
} )( DemoShortcodeDialog );
