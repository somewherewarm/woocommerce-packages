const defaultConfig                  = require( '@wordpress/scripts/config/webpack.config' );
const WooCommerceDepExtractionPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );
const path                           = require( 'path' );

// Disable minification. It will be minimized in Grunt Uglify task.
defaultConfig.optimization.minimize = false;

// Allow babel-loader to process @somewherewarm files as well.
defaultConfig.module.rules[0].exclude = /node_modules\/(?!@somewherewarm).*/;

// Attach front-end deps.
const wcDepMap = {
	'@woocommerce/blocks-checkout': [ 'wc', 'blocksCheckout' ],
	'@woocommerce/price-format': [ 'wc', 'priceFormat' ],
	'@woocommerce/settings': [ 'wc', 'wcSettings' ],
};

const wcHandleMap = {
	'@woocommerce/blocks-checkout': 'wc-blocks-checkout',
	'@woocommerce/price-format': 'wc-price-format',
	'@woocommerce/settings': 'wc-settings',
};

const requestToExternal = ( request ) => {
	if ( wcDepMap[ request ] ) {
		return wcDepMap[ request ];
	}
};

const requestToHandle = ( request ) => {
	if ( wcHandleMap[ request ] ) {
		return wcHandleMap[ request ];
	}
};

// Export configuration.
module.exports = {
	...defaultConfig,
	resolve: {
		alias: {
			...defaultConfig.resolve.alias,
			'@somewherewarm': '@somewherewarm/woocommerce/packages',
		}
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new WooCommerceDepExtractionPlugin( {
			requestToExternal,
			requestToHandle
		} ),
	],
};
