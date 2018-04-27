const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin') //installed via npm

module.exports = {
  entry: './src/index.js',
  devtool: "source-map",
  output: {
     path: path.resolve(__dirname, 'dist/js'),
     filename: 'nyc-lib.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    },
    {
      test: /jquery[\\\/]src[\\\/]selector\.js$/,
      loader: 'amd-define-factory-patcher-loader'
    }]
  },
  resolve: {
    alias: {
      nyc: path.resolve(__dirname, './src/nyc')
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ]
}
