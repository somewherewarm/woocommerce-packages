const defaultConfig                  = require( '@wordpress/scripts/config/webpack.config' );
const WooCommerceDepExtractionPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );
const path                           = require( 'path' );
const production                     = process.env.NODE_ENV === 'production';

// Disable minification. It will be minimized in Grunt Uglify task.
defaultConfig.optimization.minimize = false;

// Export configuration.
module.exports = {
	...defaultConfig,
	entry: {
		'admin/analytics': '/resources/js/admin/analytics/index.js',
	},
	output: {
		path: path.resolve( __dirname, 'assets/js' ),
		filename: '[name].js',
	},
	resolve: {
		alias: {
			...defaultConfig.resolve.alias,
			'@somewherewarm': path.resolve( __dirname, './nodemodules/@somewherewarm/' ),
		}
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new WooCommerceDepExtractionPlugin(),
	],
};
