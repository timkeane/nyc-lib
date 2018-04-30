console.warn(`process.env.NODE_ENV=${process.env.NODE_ENV}`)

const isProd = process.env.NODE_ENV === 'production'
const webpack = require('webpack');
const path = require('path')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const plugins = [
  new CleanWebpackPlugin(['dist']),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new BundleAnalyzerPlugin({analyzerMode: 'static'})
]

if (isProd) {
  plugins.push(new MinifyPlugin())
}

module.exports = {
  entry: './src/index.js',
  devtool: isProd ? false : "source-map",
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
    }]
  },
  resolve: {
    alias: {
      nyc: path.resolve(__dirname, './src/nyc')
    }
  },
  plugins: plugins
}
