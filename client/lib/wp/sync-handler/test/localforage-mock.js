export default function( localData ) {
	console.log( 'creatingLocalForage', localData );
	return {
		getLocalForage() {
			console.log( 'getLocalForage', localData );
			return {
				setItem( key, data ) {
					console.log( 'setItem', localData );
					return new Promise( resolve => {
						localData[ key ] = data;
						resolve();
					} )
				},
				getItem( key ) {
					console.log( 'getItem', localData );
					return new Promise( resolve => {
						resolve( localData[ key ] );
					} );
				},
				removeItem( key ) {
					return new Promise( resolve => {
						delete localData[ key ];
						resolve();
					} );
				},
				keys() {
					return new Promise( resolve => {
						resolve( Object.keys( localData ) );
					} )
				}
			};
		}
	};
};
