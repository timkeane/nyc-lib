module.exports = {
  plugins: ['dev', 'development'].indexOf(process.env.NODE_ENV) > -1 ? [] : [
    require('postcss-import')({}),
    require('postcss-css-variables')({}),
    require('postcss-clean')({})
  ]
}