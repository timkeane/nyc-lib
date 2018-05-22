const isProd = ['production', 'prod', 'prd'].indexOf(process.env.NODE_ENV) > -1
let plugins = []
if (isProd) {
  plugins = [
    require('postcss-import')({}),
    require('postcss-css-variables')({}),
    require('postcss-clean')({})
  ]
}
module.exports = {
  plugins: plugins
}