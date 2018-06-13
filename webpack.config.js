const nodeEnv = process.env.NODE_ENV
const version = require('./package.json').version
require('dotenv').config()
const path = require('path')

console.warn(`process.env.NODE_ENV=${nodeEnv}`)
console.warn(`version=${version}`)

let devtools = 'cheap-module-eval-source-map'
const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1
const isStg = 'stg' === nodeEnv
const webpack = require('webpack')
const Clean = require('clean-webpack-plugin')
const Minify = require('babel-minify-webpack-plugin')
const Replace = require('replace-in-file-webpack-plugin')

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const plugins = [
  // new BundleAnalyzerPlugin({analyzerMode: 'static'}),
  new Clean(['dist']),
  new webpack.optimize.ModuleConcatenationPlugin()
]

if (isStg) {
  plugins.push(
    new Replace([{
      dir: 'dist/js',
      files: ['nyc-ol-lib.js', 'nyc-leaf-lib.js'],
      rules: [{
        search: 'maps{1-4}.nyc.gov',
        replace: process.env.STG_OL_TILE_HOSTS
      }, {
        search: 'maps{s}.nyc.gov',
        replace: process.env.STG_LEAF_TILE_HOSTS
      }]
    }])    
  )
}
if (isProd || isStg) {
  devtools = false
  plugins.push(new Minify())
}

module.exports = {
  entry: {
    "nyc-lib": './src/nyc-index.js',
    "nyc-ol-lib": './src/nyc-ol.js',
    "nyc-leaf-lib": './src/nyc-leaf.js',
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
        presets: ['es2015']
      }
    }]
  },
  externals: {
    jquery: 'jQuery',
    
    'ol/extent': 'ol.extent',
    'ol/coordinate': 'ol.coordinate',
    'ol/tilegrid': 'ol.tilegrid',
    'ol/feature': 'ol.Feature',
    'ol/map': 'ol.Map',
    'ol/view': 'ol.View',
    'ol/overlay': 'ol.Overlay',
    'ol/geolocation': 'ol.Geolocation',
    'ol/format/feature': 'ol.format.Feature',
    'ol/format/geojson': 'ol.format.GeoJSON',
    'ol/format/formattype': 'ol.format.FormatType',
    'ol/source/vector': 'ol.source.Vector',
    'ol/source/xyz': 'ol.source.XYZ',
    'ol/layer/vector': 'ol.layer.Vector',
    'ol/layer/tile': 'ol.layer.Tile',
    'ol/style/style': 'ol.style.Style',
    'ol/style/icon': 'ol.style.Icon',
    'ol/geom/point': 'ol.geom.Point',
    'ol/geom/linestring': 'ol.geom.LineString',
    'ol/geom/polygon': 'ol.geom.Polygon',
    'ol/proj/projection': 'ol.proj.Projection',

    'text-encoding': 'window',
    leaflet: 'L',
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
