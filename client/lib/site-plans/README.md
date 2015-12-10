SitePlansStore
-----------------

`SitePlansStore` is a store containing plans details for each site.
It is an array of site plans data, keyed by the slug of the site, each site has an array of all (currently 3) plans.


The site plans contains information about:
- `id`: The plan id
- `currentPlan`: Whether this is the current plan or not
- `productName`: The name of the plan
- `productSlug`: The shorthand name for the plan
- `rawDiscount`: The amount of discount you received if you have already purchased a plan
- `rawPrice`: The price as a number
- `formattedPrice`: The formatted string for the price including the currency

New properties available when `currentPlan` is true:
- `freeTrial`: Whether a plan is already a free trial
- `expiry`: Date of expiration of the plan
- `expiryMoment`
- `subscribedDate`: The date of subscription of the plan
- `subscribedMoment`
- `userFacingExpiry`: The date we tell the user his plan will expire
- `userFacingExpiryMoment`




## Usage

The store is a singleton object which offers `get` and `getBySite` methods to retrieve data:

```js
import SitePlansStore from 'lib/site-plans/store';

SitePlansStore.get()
SitePlansStore.getBySite( 'example.wordpress.com' )
```
