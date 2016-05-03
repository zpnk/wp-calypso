/**
 * Internal dependencies
 */
import config from 'config';
import userFactory from 'lib/user';
import { makeLayout } from 'controller';
import { navigation, siteSelection } from 'my-sites/controller';
import { singleSite, multiSite, loggedOut } from './controller';

export default function( router ) {
	const user = userFactory();
	const isLoggedIn = !! user.get();

	if ( config.isEnabled( 'manage/themes' ) ) {
		if ( isLoggedIn ) {
			router( '/design', multiSite, navigation, siteSelection );
			router( '/design/:site_id', singleSite, navigation, siteSelection );
			router( '/design/type/:tier', multiSite, navigation, siteSelection );
			router( '/design/type/:tier/:site_id', singleSite, navigation, siteSelection );
		} else {
			router( '/design', loggedOut, makeLayout );
			router( '/design/type/:tier', loggedOut, makeLayout );
		}
	}
}
