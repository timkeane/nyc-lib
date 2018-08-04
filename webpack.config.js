const nodeEnv = process.env.NODE_ENV
const version = require('./package.json').version
const path = require('path')
const replace = require('nyc-build-helper').replace

console.log(`process.env.NODE_ENV=${nodeEnv}`)
console.log(`version=${version}`)

const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1
const isStg = 'stg' === nodeEnv
const isDev = !isStg && !isProd
let devtools = false //isDev ? 'cheap-module-eval-source-map' : false
const webpack = require('webpack')
const Copy = require('copy-webpack-plugin')
const Clean = require('clean-webpack-plugin')
const Minify = require('babel-minify-webpack-plugin')

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const copyFiles = [{
  from: path.resolve(__dirname, 'examples'), 
  to: path.resolve(__dirname, 'dist/examples'),
  toType: 'dir'
}, {
  from: isDev ? path.resolve(__dirname, 'src/css') : path.resolve(__dirname, 'tmp/css'), 
  to: path.resolve(__dirname, 'dist/css'),
  toType: 'dir'
}]

const plugins = [
  // new BundleAnalyzerPlugin({analyzerMode: 'static'}),
  new Clean(['dist'], {root: __dirname}),
  new Copy(copyFiles),
  new webpack.optimize.ModuleConcatenationPlugin(),
  replace.replacePlugin(__dirname)
]

if (!isDev) {
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
    'ol/proj': 'ol.proj',
    'ol/tilegrid': 'ol.tilegrid',
    'ol/Feature': 'ol.Feature',
    'ol/Map': 'ol.Map',
    'ol/View': 'ol.View',
    'ol/Overlay': 'ol.Overlay',
    'ol/Geolocation': 'ol.Geolocation',
    'ol/format/Feature': 'ol.format.Feature',
    'ol/format/GeoJSON': 'ol.format.GeoJSON',
    'ol/format/FormatType': 'ol.format.FormatType',
    'ol/format/WKT': 'ol.format.WKT',
    'ol/source/Vector': 'ol.source.Vector',
    'ol/source/XYZ': 'ol.source.XYZ',
    'ol/layer/Vector': 'ol.layer.Vector',
    'ol/layer/Tile': 'ol.layer.Tile',
    'ol/style/Style': 'ol.style.Style',
    'ol/style/Icon': 'ol.style.Icon',
    'ol/geom/Point': 'ol.geom.Point',
    'ol/geom/LineString': 'ol.geom.LineString',
    'ol/geom/Polygon': 'ol.geom.Polygon',
    'ol/proj/Projection': 'ol.proj.Projection',

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
