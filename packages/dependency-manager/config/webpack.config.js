const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const WooCommerceDepExtractionPlugin = require('@woocommerce/dependency-extraction-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

// Remove SASS rule from the default config so we can define our own.
const defaultRules = defaultConfig.module.rules.filter((rule) => {
	return String(rule.test) !== String(/\.(sc|sa)ss$/);
});

// Include node_modules/@somewherewarm scripts in all loaders.
for (var key in defaultConfig.module.rules) {

	if (!defaultConfig.module.rules.hasOwnProperty(key)) {
		continue;
	}

	var rule = defaultConfig.module.rules[key];
	for (var prop in rule) {

		if (!rule.hasOwnProperty(prop) || prop !== 'exclude') {
			continue;
		}

		defaultConfig.module.rules[key][prop] = /node_modules\/(?!@somewherewarm).*/;
	}
}

// Define custom SASS rule.
const customSassRule = {
	test: /\.(sc|sa)ss$/,
	exclude: /(node_modules)/,
	use: [
		MiniCssExtractPlugin.loader,
		{ loader: 'css-loader', options: { importLoaders: 1 } },
		{
			loader: 'sass-loader',
			options: {
				sassOptions: {
					includePaths: ['node_modules', 'resources/js/frontend/blocks/sass', 'resources/js/admin/analytics/sass'],
					outputStyle: 'compressed',
				},
				sourceMap: isProduction ? false : true,
				webpackImporter: false,
				additionalData: (content) => {

					const styleImports = [
						'colors',
						'breakpoints',
						'variables',
						'mixins',
						'animations',
						'z-index',
					]
						.map(
							(imported) =>
								`@import "@wordpress/base-styles/${imported}";`
						)
						.join(' ');

					const localImports = `
						@import "@automattic/color-studio/dist/color-variables";
					`;
					return styleImports + localImports + content;
				},
			},
		},
	],
};

// Attach front-end deps.
const wcDepMap = {
	'@woocommerce/blocks-registry': ['wc', 'wcBlocksRegistry'],
	'@woocommerce/settings': ['wc', 'wcSettings'],
	'@woocommerce/block-data': ['wc', 'wcBlocksData'],
	'@woocommerce/shared-context': ['wc', 'wcBlocksSharedContext'],
	'@woocommerce/shared-hocs': ['wc', 'wcBlocksSharedHocs'],
	'@woocommerce/price-format': ['wc', 'priceFormat'],
	'@woocommerce/blocks-checkout': ['wc', 'blocksCheckout'],
};

const wcHandleMap = {
	'@woocommerce/blocks-registry': 'wc-blocks-registry',
	'@woocommerce/settings': 'wc-settings',
	'@woocommerce/block-settings': 'wc-settings',
	'@woocommerce/block-data': 'wc-blocks-data-store',
	'@woocommerce/shared-context': 'wc-blocks-shared-context',
	'@woocommerce/shared-hocs': 'wc-blocks-shared-hocs',
	'@woocommerce/price-format': 'wc-price-format',
	'@woocommerce/blocks-checkout': 'wc-blocks-checkout',
};

const requestToExternal = (request) => {
	if (wcDepMap[request]) {
		return wcDepMap[request];
	}
};

const requestToHandle = (request) => {
	if (wcHandleMap[request]) {
		return wcHandleMap[request];
	}
};

// Export configuration.
module.exports = {
	...defaultConfig,
	output: {
		path: path.resolve(__dirname, 'assets/dist'),
		filename: '[name].js',
	},
	resolve: {
		alias: {
			...defaultConfig.resolve.alias,
			'@somewherewarm': '@somewherewarm/woocommerce/packages',
		}
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultRules,
			customSassRule,
		],
	},
	optimization: {
		...defaultConfig.optimization,
		splitChunks: {
			cacheGroups: {
				default: false
			}
		},
		// Disable minification. It will be minimized in Grunt Uglify task.
		minimize: false
	},
	plugins: [
		...defaultConfig.plugins.filter(
			(plugin) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new WooCommerceDepExtractionPlugin({
			requestToExternal,
			requestToHandle
		}),
		new MiniCssExtractPlugin({
			filename: `[name].css`,
		}),
	],
};
