module.exports = {
  plugins: process.env.NODE_ENV === 'dev' ? [] : [
    require('postcss-import')({}),
    require('postcss-css-variables')({}),
    require('postcss-clean')({})
  ]
}