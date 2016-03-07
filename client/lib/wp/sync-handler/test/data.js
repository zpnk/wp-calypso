/**
 * Internal dependencies
 */
import { RECORDS_LIST_KEY } from '../constants';

export const postListParams = {
	apiVersion: '1.1',
	method: 'GET',
	path: '/sites/bobinprogress.wordpress.com/posts',
	query: 'status=publish%2Cprivate&order_by=date&order=DESC&author=6617482&type=post&site_visibility=visible&meta=counts',
};

export const postListParamsDifferentOrder = {
	apiVersion: '1.1',
	method: 'GET',
	path: '/sites/bobinprogress.wordpress.com/posts',
	query: 'order_by=date&order=DESC&author=6617482&type=post&site_visibility=visible&meta=counts&status=publish%2Cprivate',
};

export const postListParamsNextPage = {
	apiVersion: '1.1',
	method: 'GET',
	path: '/sites/bobinprogress.wordpress.com/posts',
	query: 'status=publish%2Cprivate&order_by=date&order=DESC&author=6617482&type=post&site_visibility=visible&meta=counts&page_handle=2014-11-24T13%3A39%3A39-08%3A00%26id=1307',
};

export const postListParamsDifferent = Object.assign( {}, postListParams, { query: 'filter=test' } );

export const postListResponseBody = {
	found: 2,
	meta: {
		data: {},
		links: {},
		next_page: 'value=2014-11-24T13%3A39%3A39-08%3A00&id=9900',
	},
	posts: [
		{ ID: 9900 },
		{ ID: 9901 },
	],
};

export const postListLocalRecord = {
	__sync: {
		key: 'sync-record-479116342443bd6491db5eea5b56bf69fff8ecab',
		synced: 1457329263679,
		syncing: false,
	},
	body: postListResponseBody,
	params: Object.assign( {}, postListParams, {
		callback: 'q1i5cl2',
		supports_args: true,
		supports_progress: true,
	} ),
};

export const postListResponseBodyFresh = {
	found: 3,
	meta: {
		data: {},
		links: {},
		next_page: 'value=2014-11-26T13%3A39%3A39-08%3A00&id=9899',
	},
	posts: [
		{ ID: 9899 },
		{ ID: 9900 },
		{ ID: 9901 },
	]
}

export const nonWhiteListedRequest = {
	apiVersion: '1.1',
	method: 'GET',
	path: '/not-whitelisted',
};

export const postListResponseBodyNoHandle = Object.assign( {}, postListResponseBody, { meta: {} } );

export const recordsList = [
	{ key: 'sync-record-365dbe1d91c3837b050032189c7b66ee60477bb0', timestamp: 1457329204357 },
	{ key: 'sync-record-479116342443bd6491db5eea5b56bf69fff8ecab', timestamp: 1457329263835 },
	{ key: 'sync-record-c73140d991b14fef79b4763ce6f918cc936505ba', timestamp: 1457329442428 },
];

export const localDataFull = {
	'sync-record-365dbe1d91c3837b050032189c7b66ee60477bb0': postListLocalRecord,
	'sync-record-479116342443bd6491db5eea5b56bf69fff8ecab': Object.assign( {}, postListLocalRecord ),
	'sync-record-c73140d991b14fef79b4763ce6f918cc936505ba': Object.assign( {}, postListLocalRecord ),
	[ RECORDS_LIST_KEY ]: recordsList,
}
