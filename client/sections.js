var config = require( 'config' ),
	readerPaths;

var sections, editorPaths;

sections = [
	{
		name: 'customize',
		paths: [ '/customize' ],
		module: 'my-sites/customize',
		enableOffline: false
	},
	{
		name: 'me',
		paths: [ '/me', '/purchases' ],
		module: 'me',
		enableOffline: false
	},
	{
		name: 'media',
		paths: [ '/media' ],
		module: 'my-sites/media',
		enableOffline: false
	},
	{
		name: 'menus',
		paths: [ '/menus' ],
		module: 'my-sites/menus',
		enableOffline: true
	},
	{
		name: 'people',
		paths: [ '/people' ],
		module: 'my-sites/people',
		enableOffline: true
	},
	{
		name: 'plugins',
		paths: [ '/plugins' ],
		module: 'my-sites/plugins',
		enableOffline: true
	},
	{
		name: 'posts-pages',
		paths: [ '/pages' ],
		module: 'my-sites/pages',
		enableOffline: true
	},
	{
		name: 'posts-pages',
		paths: [ '/posts' ],
		module: 'my-sites/posts',
		enableOffline: true
	},
	{
		name: 'settings',
		paths: [ '/settings' ],
		module: 'my-sites/site-settings',
		enableOffline: false
	},
	{
		name: 'sharing',
		paths: [ '/sharing' ],
		module: 'my-sites/sharing',
		enableOffline: false
	},
	{
		name: 'signup',
		paths: [ '/start', '/phone', '/log-in' ],
		module: 'signup',
		enableLoggedOut: true,
		enableOffline: false
	},
	{
		name: 'stats',
		paths: [ '/stats' ],
		module: 'my-sites/stats',
		enableOffline: true
	},
	{
		name: 'themes',
		paths: [ '/design' ],
		module: 'my-sites/themes',
		enableLoggedOut: config.isEnabled( 'manage/themes/logged-out' ),
		enableOffline: false
	},
	{
		name: 'upgrades',
		paths: [ '/domains', '/checkout' ],
		module: 'my-sites/upgrades',
		enableOffline: false
	},
	{
		name: 'upgrades',
		paths: [ '/plans' ],
		module: 'my-sites/plans',
		enableOffline: false
	}
];

if ( config.isEnabled( 'manage/ads' ) ) {
	sections.push( {
		name: 'ads',
		paths: [ '/ads' ],
		module: 'my-sites/ads',
		enableOffline: false
	} );
}

if ( config.isEnabled( 'manage/drafts' ) ) {
	sections.push( {
		name: 'posts-pages',
		paths: [ '/drafts' ],
		module: 'my-sites/drafts',
		enableOffline: true
	} );
}

if ( config.isEnabled( 'reader' ) ) {
	readerPaths = [ '/', '/read', '/fresh', '/activities', '/find-friends', '/tag' ];

	if ( config.isEnabled( 'reader/following-edit' ) ) {
		readerPaths.push( '/following' );
	}

	if ( config.isEnabled( 'reader/recommendations' ) ) {
		readerPaths.push( '/recommendations' );
		readerPaths.push( '/tags' );
	}

	if ( config.isEnabled( 'reader/discover' ) ) {
		readerPaths.push( '/discover' );
	}

	sections.push( {
		name: 'reader',
		paths: readerPaths,
		module: 'reader',
		enableOffline: true
	} );
}

if ( config.isEnabled( 'post-editor' ) ) {
	editorPaths = [ '/post' ];

	if ( config.isEnabled( 'post-editor/pages' ) ) {
		editorPaths.push( '/page' );
	}

	sections.push( {
		name: 'post-editor',
		paths: editorPaths,
		module: 'post-editor',
		enableOffline: true
	} );
}

if ( config.isEnabled( 'devdocs' ) ) {
	sections.push( {
		name: 'devdocs',
		paths: [ '/devdocs' ],
		module: 'devdocs',
		enableLoggedOut: true,
		enableOffline: true
	} );
}

if ( config.isEnabled( 'vip' ) ) {
	sections.push( {
		name: 'vip',
		paths: [ '/vip', '/vip/deploys', '/vip/billing', '/vip/support', '/vip/backups', '/vip/logs' ],
		module: 'vip',
		enableOffline: true
	} );
}

if ( config.isEnabled( 'help' ) ) {
	sections.push( {
		name: 'help',
		paths: [ '/help' ],
		module: 'me/help',
		enableOffline: true
	} );
}

if ( config.isEnabled( 'accept-invite' ) ) {
	sections.push( {
		name: 'accept-invite',
		paths: [ '/accept-invite' ],
		module: 'my-sites/invites',
		enableLoggedOut: true,
		enableOffline: false
	} );
}

if ( config.isEnabled( 'oauth' ) ) {
	sections.push( {
		name: 'auth',
		paths: [ '/login' ],
		module: 'auth',
		enableLoggedOut: true,
		enableOffline: false
	} );
}

if ( config.isEnabled( 'mailing-lists/unsubscribe' ) ) {
	sections.push( {
		name: 'mailing-lists',
		paths: [ '/mailing-lists' ],
		module: 'mailing-lists',
		enableLoggedOut: true,
		enableOffline: false
	} );
}

module.exports = sections;
