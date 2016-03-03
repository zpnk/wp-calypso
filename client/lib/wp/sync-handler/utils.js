/**
 * External dependencies
 */
import Hashes from 'jshashes';
import debugFactory from 'debug';

const debug = debugFactory( 'calypso:sync-handler' );
/**
 * Generate a key from the given param object
 *
 * @param {Object} params - request parameters
 * @param {Boolean} applyHash - codificate key when it's true
 * @return {String} request key
 */
export const generateKey = ( params, applyHash = true ) => {
	var key = `${params.apiVersion || ''}-${params.method}-${params.path}`;

	if ( params.query ) {
		key += '-' + params.query;
	}

	if ( applyHash ) {
		key = new Hashes.SHA1().hex( key );
	}

	key = 'sync-record-' + key;

	debug( 'key: %o', key );
	return key;
}
