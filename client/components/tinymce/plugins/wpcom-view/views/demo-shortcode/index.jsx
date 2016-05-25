/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependecies
 */
import shortcodeUtils from 'lib/shortcode';

export default React.createClass( {
	statics: {
		match( content ) {
			const match = shortcodeUtils.next( 'shortcode', content );

			if ( match ) {
				return {
					index: match.index,
					content: match.content,
					options: {
						shortcode: match.shortcode
					}
				};
			}
		},

		serialize( content ) {
			return content;
		},

		edit( editor, content ) {
			//open dialog here
			editor.execCommand( 'wpcomDemoShortcode', content );
		}
	},

	render() {
		return (
			<div className="wpview-content wpview-type-demo-shortcode">
				<p>shortcode</p>
				<p>{ this.props.content }</p>
			</div>
		);
	}
} );
