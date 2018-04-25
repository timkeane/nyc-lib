const path = require('path')

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
    }],
    resolve: {
      alias: {
        nyc: path.resolve(__dirname, '..', 'src', 'nyc')
      }
    }
  }
}
