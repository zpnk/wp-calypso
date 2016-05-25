/**
 * External Dependencies
 */
import tinymce from 'tinymce/tinymce';
import i18n from 'lib/mixins/i18n';
import React, { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
/**
 * Internal Dependencies
 */
import Gridicon from 'components/gridicon';
import ContactFormDialog from './dialog';
import {
	shortcodeClear,
	shortcodeUpdate
} from 'state/ui/editor/demo-shortcode/actions';

const wpcomDemoShortcode = editor => {
	let node;
	const store = editor.getParam( 'redux_store' );

	editor.on( 'init', () => {
		node = editor.getContainer().appendChild(
			document.createElement( 'div' )
		);
	} );

	editor.on( 'remove', () => {
		unmountComponentAtNode( node );
		node.parentNode.removeChild( node );
		node = null;
	} );

	editor.addCommand( 'wpcomDemoShortcode', content => {
		let isEdit = false;
		if ( content ) {
			store.dispatch( shortcodeUpdate( content ) );
			isEdit = true;
		} else {
			store.dispatch( shortcodeClear() );
		}

		function renderModal( visibility = 'show' ) {
			render(
				createElement( Provider, { store },
					createElement( ContactFormDialog, {
						showDialog: visibility === 'show',
						isEdit,
						onInsert() {
							const state = store.getState();
							editor.execCommand( 'mceInsertContent', false, state.ui.editor.demoShortcode );
						},
						onChangeTabs( tab ) {
							renderModal( 'show', tab );
						},
						onClose() {
							store.dispatch( shortcodeClear() );
							editor.focus();
							renderModal( 'hide' );
						}
					} )
				),
				node
			);
		}

		renderModal();
	} );

	editor.addButton( 'wpcom_demo_shortcode', {
		classes: 'btn wpcom-icon-button contact-form',
		title: i18n.translate( 'Add Contact Form' ),
		cmd: 'wpcomDemoShortcode',
		onPostRender() {
			this.innerHtml( renderToStaticMarkup(
				<button type="button" role="presentation">
					<Gridicon icon="block" />
				</button>
			) );
		}
	} );
};

export default () => {
	tinymce.PluginManager.add( 'wpcom/demoshortcode', wpcomDemoShortcode );
};
