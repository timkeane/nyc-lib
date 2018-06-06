module.exports = {
  plugins: [
    require('postcss-import')({}),
    require('postcss-css-variables')({}),
    require('postcss-clean')({})
  ]
}