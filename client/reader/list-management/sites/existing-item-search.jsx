import React from 'react';

import SearchCard from 'components/search-card';
import Item from './list-item';

export default React.createClass( {

	getInitialState() {
		return {
			results: []
		}
	},

	handleSearch() {

	},

	renderResults() {
		if ( this.state.results.length > 0 ) {
			return this.state.results.map( sub => {
				return <Item 			} );
		}
	},

	render() {
		return (
		<section>
				<h3>{ this.translate( 'Add Sites' ) }</h3>
				<SearchCard
					onSearch={ this.handleSearch }
					placeholder={ this.translate( 'Add an exising subscription, or a new site' ) }
				/>
				{ this.renderResults() }
		</section>
		);
	}
} );
