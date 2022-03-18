# @somewherewarm/woocommerce

Collection of WooCommerce packages for building stuff with ReactJS + Gutenberg.

## Usage

This repo can be used for the following purposes: 

### Webpack Configuration

Include the dependency in your local `package.json`:
```json
"@somewherewarm/woocommerce": "^1.1.0"
```

Then, in your `webpack.config.js` you'll need to grap the latest dependecy manager as your main config array:
```js
const defaultConfig = require( '@somewherewarm/woocommerce/packages/dependency-manager/config/webpack.config' );
```

From here, you only need to add your entrypoints and output path. Here's an example of how your webpack may look like:
```js
const defaultConfig = require( '@somewherewarm/woocommerce/packages/dependency-manager/config/webpack.config' );
const path          = require( 'path' );

module.exports = {
    ...defaultConfig,
    entry: {
        'admin/analytics': '/resources/js/admin/analytics/index.js',
        'frontend/blocks': '/resources/js/frontend/blocks/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        filename: '[name].js',
    }
};
```

### React Packages

Available packages:
- `components`
- `lib`

Use them in your project by using the following import schema:
```js
import Module from '@somewherewarm/[package_name]'
```
_e.g._
```js
import ReportTable from '@somewherewarm/components'
```

Available components:
- `ReportChart`
- `ReportError`
- `ReportSummary`
- `ReportTable`

### SASS

You can import any SASS file into your JS files. 

Every file will also automatically resolve several WordPress & Gutenberg variables for you. Here's the list for reference:
- https://github.com/WordPress/gutenberg/tree/trunk/packages/base-styles
- https://github.com/Automattic/color-studio/blob/master/dist/color-variables.scss

#### Global files

Global SASS files can be created in any of the following special directories:
- `resources/js/frontend/sass` 
- `resources/js/admin/analytics/sass` and;
- `node_modules`

For example, if you have a local file named _"\_colors.scss"_ inside your `resources/js/frontend/sass` then you could import this file from any SASS file path using the following simple import:
```js
// ./resources/js/frontend/blocks/components/text-input/index.js
@import "colors";
```

The system will resolve this to `resources/js/frontend/sass/_colors.scss`.
