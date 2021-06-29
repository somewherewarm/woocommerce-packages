# @somewherewarm/woocommerce

Collection of WooCommerce packages.

## Usage

Include the dependecy in your local `package.json`:
```json
"@somewherewarm/woocommerce": "^1.0.0"
```

Then, in your `webpack.config.js` you'll need to grap the latest dependecy manager as your main config array:
```js
const defaultConfig = require( '@somewherewarm/woocommerce/packages/dependency-manager/config/webpack.config' );
```

Use the available packages in your project by importing them using the following schema:
```js
import Module from '@somewherewarm/[package_name]'
```
_e.g._
```js
import ReportTable from '@somewherewarm/components'
```
