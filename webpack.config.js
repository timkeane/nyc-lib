console.warn(`process.env.NODE_ENV=${process.env.NODE_ENV}`)

const isProd = ['production', 'prod', 'prd'].indexOf(process.env.NODE_ENV) > -1
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
  externals: {
    jquery: 'jQuery',
    'ol/extent': '(window.ol ? ol.extent : {})',
    'ol/coordinate': '(window.ol ? ol.coordinate : {})',
    'ol/tilegrid': '(window.ol ? ol.tilegrid : {})',
    'ol/feature': '(window.ol ? ol.Feature : function(){})',
    'ol/map': '(window.ol ? ol.Map : function(){})',
    'ol/view': '(window.ol ? ol.View : function(){})',
    'ol/overlay': '(window.ol ? ol.Overlay : function(){})',
    'ol/geolocation': '(window.ol ? ol.Geolocation : function(){})',
    'ol/format/feature': '(window.ol ? ol.format.Feature : function(){})',
    'ol/format/geojson': '(window.ol ? ol.format.GeoJSON : function(){})',
    'ol/format/formattype': '(window.ol ? ol.format.FormatType : function(){})',
    'ol/source/vector': '(window.ol ? ol.source.Vector : function(){})',
    'ol/source/xyz': '(window.ol ? ol.source.XYZ : function(){})',
    'ol/layer/vector': '(window.ol ? ol.layer.Vector : function(){})',
    'ol/layer/tile': '(window.ol ? ol.layer.Tile : function(){})',
    'ol/style/style': '(window.ol ? ol.style.Style : function(){})',
    'ol/style/icon': '(window.ol ? ol.style.Icon : function(){})',
    'ol/geom/point': '(window.ol ? ol.geom.Point : function(){})',
    'ol/geom/linestring': '(window.ol ? ol.geom.LineString : function(){})',
    'ol/geom/polygon': '(window.ol ? ol.geom.Polygon : function(){})',
    'ol/proj/projection': '(window.ol ? ol.proj.Projection : function(){})',

    'text-encoding': 'window',
    'leaflet': '(window.L || {})',
    'shapefile': '(window.shapefile || {})',
    'papaparse': '(window.Papa || {})',
    'proj4': '(window.proj4 || {})'
  },    
  resolve: {
    alias: {
      nyc: path.resolve(__dirname, './src/nyc')
    }
  },
  plugins: plugins
}
