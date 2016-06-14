// External dependencies
import React from 'react';
import { connect } from 'react-redux';

// Internal dependencies
import SiteIcon from 'components/site-icon';
import { getSite } from 'state/reader/sites/selectors';

const StartCardHeader = ( { site } ) => {
	return (
		<header className="reader-start-card__header">
			<a href={ `/read/blogs/${site.ID}` }>
				<SiteIcon site={ site } size={ 40 } />
			</a>
			<h1 className="reader-start-card__site-title">{ site.title }</h1>
		</header>
	);
};

StartCardHeader.propTypes = {
	siteId: React.PropTypes.number.isRequired
};

export default connect(
	( state, ownProps ) => {
		return {
			site: getSite( state, ownProps.siteId )
		};
	}
)( StartCardHeader );
