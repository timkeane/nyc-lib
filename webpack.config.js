const nodeEnv = process.env.NODE_ENV
const version = require('./package.json').version
const path = require('path')
const replace = require('nyc-build-helper').replace

console.log(`process.env.NODE_ENV=${nodeEnv}`)
console.log(`version=${version}`)

const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1
const isStg = 'stg' === nodeEnv
const isDev = !isStg && !isProd
const devtools = isDev ? 'source-map' : false
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const Minify = require('babel-minify-webpack-plugin')

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const copyFiles = [
  {
    from: path.resolve(__dirname, 'examples'), 
    to: path.resolve(__dirname, 'dist/examples'),
    toType: 'dir'
  }, {
    from: isDev ? path.resolve(__dirname, 'src/css') : path.resolve(__dirname, 'tmp/css'), 
    to: path.resolve(__dirname, 'dist/css'),
    toType: 'dir'
  },
  path.resolve(__dirname, 'chmod-scripts.js')
]

const plugins = [
  // new BundleAnalyzerPlugin({analyzerMode: 'static'}),
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin(copyFiles),
  new webpack.optimize.ModuleConcatenationPlugin(),
  replace.replacePlugin(__dirname)
]

if (!isDev) {
  plugins.push(new Minify())
}

const conf = {
  entry: {
    "nyc-lib": './src/nyc-index.js',
    "nyc-ol-lib": './src/nyc-ol.js',
    "babel-polyfill": "babel-polyfill"
  },
  output: {
     path: path.resolve(__dirname, 'dist/js'),
     filename: '[name].js'
  },
  devtool: devtools,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['@babel/preset-env']
      }
    }]
  },
  externals: {
    jquery: 'jQuery',
    shapefile: '(window.shapefile || {})',
    papaparse: '(window.Papa || {})',
    proj4: '(window.proj4 || {defs: function(){}})'
  },
  resolve: {
    alias: {
      nyc: path.resolve(__dirname, './src/nyc')
    }
  },
  plugins: plugins
}

console.warn(conf)

module.exports = conf
