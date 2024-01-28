const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		'my-place': path.resolve(__dirname, 'src', 'MyPlace.js'),
		'share-place': path.resolve(__dirname, 'src', 'SharePlace.js'),
	},
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, 'dist', 'assets', 'scripts'),
		filename: '[name].[contenthash].js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(?:js|mjs|cjs)$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{ useBuiltIns: 'usage', corejs: { version: 3 } },
							],
						],
					},
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
			filename: path.resolve(__dirname, 'dist', 'index.html'),
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'my-place', 'my-place.html'),
			filename: path.resolve(__dirname, 'dist', 'my-place', 'index.html'),
		}),
	],
	devServer: {
		static: path.resolve(__dirname, 'dist'),
		open: true,
	},
};
