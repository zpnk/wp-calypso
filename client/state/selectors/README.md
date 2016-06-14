State Selectors
===============

This folder contains all available state selectors. Each file includes a single exported function which can be used as a helper in retrieving specific data from the global state tree.

[See "Our Approach to Data" for more information about selectors.](../../../docs/our-approach-to-data.md#selectors)

When adding a new selector to this directory, make note of the following details:

- Each new selector exists in its own file (no more than a single exported function per file)
- Tests for each selector should exist in the [`test/` subdirectory](./test) with matching file name to the selector
- Your selector should be exported from [`index.js`](./index.js) to facilitate named importing from the base `state/selectors` directory
