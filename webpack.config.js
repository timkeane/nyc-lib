console.warn(`process.env.NODE_ENV=${process.env.NODE_ENV}`)

const isProd = process.env.NODE_ENV === 'production'
const webpack = require('webpack');
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const plugins = [
  new CleanWebpackPlugin(['dist']),
  // new BundleAnalyzerPlugin({analyzerMode: 'static'}),
  new webpack.optimize.ModuleConcatenationPlugin()
]

if (isProd) {
  plugins.push(new MinifyPlugin())
  // new UglifyJSPlugin({parallel: true})
}

module.exports = {
  entry: './src/index.js',
  devtool: isProd ? false : "cheap-module-eval-source-map",
  // devtool: isProd ? false : "source-map",
  output: {
     path: path.resolve(__dirname, 'dist/js'),
     filename: 'nyc-lib.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  resolve: {
    alias: {
      nyc: path.resolve(__dirname, './src/nyc'),
      jquerymobile: path.resolve(__dirname, './node_modules/jquery-mobile-babel-safe/dist/jquery.mobile-1.4.5.js')
    }
  },
  plugins: plugins
}
