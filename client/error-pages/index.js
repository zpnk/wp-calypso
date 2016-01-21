import page from 'page';
import ReactDom from 'react-dom';
import React from 'react';
import { setSection } from 'state/ui/actions';

export default reduxStore => {
	page( '/offline', ( context, next ) => {
		reduxStore.dispatch( setSection( 'errors-offline', { hasSidebar: true } ) );
		ReactDom.render(
			<div>
				You are offline. What are you trying to accomplish here?
			</div>,
			document.getElementById( 'primary' )
		);
	} );
}
