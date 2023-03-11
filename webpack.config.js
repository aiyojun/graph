const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	mode: 'production',
	entry: path.join(__dirname, "/src/index.js"),
	output: {
		path: path.join(__dirname, './dist'),
		filename: "bundle.js",
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'ts-loader',
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			},
			{
				test: /\.js$/, 
				use: {
					loader: 'babel-loader', 
					options: {
						presets: ['@babel/preset-env'], 
						plugins: [['@babel/plugin-transform-runtime']]
					}
				}, 
				exclude: /node_modules/
			},
			{
				test: /\.(css)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1 // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
						}
					},
	            ]
			},
			{
	            test: /\.(woff|woff2|eot|ttf|otf)$/,
	            type: 'asset/resource'
	        }
		]
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		},
		extensions: [".json", ".js", ".ts", ".css"],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			filename: "index.html",
			favicon: './public/favicon.ico',
		  	chunks: ['index'],
		  	excludeChunks: ['node_modules']
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
	devtool: "eval-source-map",
	devServer: {
		static: './dist',
		// compress: true,
		host: "0.0.0.0",
		historyApiFallback: true,
		hot: true,
		port: 8080,
	},
	performance: {
		hints: 'warning',
		maxEntrypointSize: 100000000,
		maxAssetSize: 100000000,
		assetFilter: function(assetFilename) {
			return assetFilename.endsWith('.js');
		}
	}
};