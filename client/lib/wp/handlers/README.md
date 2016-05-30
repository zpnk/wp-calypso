http-evelope-normalizer
=======================

This handler-wrapper catch errors from the server-side response generating an
error object when the body has error information.

xhr-error-normalizer
====================

Provides a wrapper around the `wpcomXhrRequest` library so it returns errors in the same format as `wpcomProxyRequest`.

Specifically this extends the `wpcomXhrRequest` error:

```js
{
	message: 'Bad request',
	status: 400,
	response: {
		body: {
			error: 'blog_name_exists',
			message: 'Sorry, that site already exists'
		}
	}
}
```

With `error` and `statusCode` from `wpcomProxyRequest`, and changes `message` to reflect the error message not the HTTP message.

```js
{
	message: 'Sorry, that site already exists',
	status: 400,
	response: {
		body: {
			error: 'blog_name_exists',
			message: 'Sorry, that site already exists'
		}
	},
	statusCode: 400,
	error: 'blog_name_exists',
	httpMessage: 'Bad request'
}
```

This allows `xhrErrorNormalizer` to be used transparently in places where `wpcomProxyRequest` errors are used.
