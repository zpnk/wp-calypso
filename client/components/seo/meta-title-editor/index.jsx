import React, { Component, PropTypes } from 'react';
import isString from 'lodash/isString';

import TokenField from 'components/token-field';

const tokenMap = {
	'Site Name': '%site_name%',
	'Tagline': '%tagline%',
	'Post Title': '%post_title'
};

export class MetaTitleEditor extends Component {
	constructor() {
		super();

		this.state = {
			values: []
		};

		this.update = this.update.bind( this );
	}

	update( rawValues ) {
		const values = rawValues.map(
			v => ! isString( v ) || tokenMap.hasOwnProperty( v ) ? v : { value: v, isBorderless: true }
		);

		this.setState( { values } );
	}

	render() {
		const { disabled = false } = this.props;
		const { values } = this.state;

		return (
			<TokenField
				disabled={ disabled }
				onChange={ this.update }
				suggestions={ Object.keys( tokenMap ) }
				value={ values }
			/>
		);
	}
}

MetaTitleEditor.propTypes = {
	disabled: PropTypes.bool
};

export default MetaTitleEditor;
