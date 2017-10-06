const path = require('path')

module.exports = {
	entry: path.resolve(__dirname, './src/index.js'),
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, '/public/js')
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		compress: true
	}
}
