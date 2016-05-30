/**
 * Detect error looking in the reponse data object
 *
 * @param {Function} handler - wpcom handler
 * @return {Function} handler wrapper
 */
const httpEnvelopeNormalizer = handler => {
	return ( params, fn ) => {
		handler( params, ( err, response ) => {
			const { code, message, data = {} } = response || {};
			const { status } = data;

			// Create Error object if the response has code and message properties
			if (
				code && typeof code === 'string' &&
				message && typeof message === 'string' &&
				status && typeof status === 'number'
			) {
				return fn( new Error( message ) );
			}

			return fn( err, response );
		} );
	};
};

export default httpEnvelopeNormalizer;
