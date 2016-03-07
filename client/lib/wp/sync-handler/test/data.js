export const postListParams = {
	apiVersion: '1.1',
	method: 'GET',
	path: '/sites/bobinprogress.wordpress.com/posts',
	query: 'status=publish%2Cprivate&order_by=date&order=DESC&author=6617482&type=post&site_visibility=visible&meta=counts',
};

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
	localRecord: {
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
	},
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
