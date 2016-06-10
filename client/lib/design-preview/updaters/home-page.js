import assign from 'lodash/assign';

let previousCustomizations = {};

export default function homePage( previewDoc, customizations ) {
	if ( hasHomePageChanged( previousCustomizations, customizations ) ) {
		// TODO: we need to reload the page if we end up here
		//fetchPreviewMarkup();
	}
	previousCustomizations.homePage = assign( {}, customizations.homePage );
}

function hasHomePageChanged( prevCustomizations, customizations ) {
	if ( ! customizations.homePage ) {
		return false;
	}
	return ( JSON.stringify( prevCustomizations.homePage ) !== JSON.stringify( customizations.homePage ) );
}
