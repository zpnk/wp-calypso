import siteTitle from './updaters/site-title';
import siteLogo from './updaters/site-logo';
import headerImage from './updaters/header-image';
import homePage from './updaters/home-page';

const updaterFunctions = [
	siteTitle,
	siteLogo,
	headerImage,
	homePage,
];

export function updatePreviewWithChanges( previewDocument, customizations, reloadPreview ) {
	updaterFunctions.map( callback => callback( previewDocument, customizations, reloadPreview ) );
}
