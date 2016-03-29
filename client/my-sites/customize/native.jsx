/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal Dependencies
 */
import DesignMenu from 'my-sites/design-menu';
import DesignPreview from 'my-sites/design-preview';

const NativeCustomizer = React.createClass( {
	render() {
		return (
			<div className="native-customizer">
				<DesignMenu />
				<DesignPreview className="layout__design" showPreview={ true } />
			</div>
		);
	}
} );

export default NativeCustomizer;
