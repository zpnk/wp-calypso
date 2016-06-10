import siteTitle from './updaters/site-title';
import headerImage from './updaters/header-image';
import homePage from './updaters/home-page';
import siteLogo from './updaters/site-logo';

const updaterFunctions = [
	siteTitle,
	headerImage,
	homePage,
	siteLogo,
];

export function updatePreviewWithChanges( previewDocument, customizations ) {
	updaterFunctions.map( callback => callback( previewDocument, customizations ) );
}
