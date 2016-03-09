let localData = {};
export default {
	setItem( key, data ) {
		return new Promise( resolve => {
			localData[ key ] = data;
			resolve();
		} )
	},
	getItem( key ) {
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
	},
	getLocalData() {
		return localData;
	},
	setLocalData( newData ) {
		localData = newData;
	},
	config() {},
};
