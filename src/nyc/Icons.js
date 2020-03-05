const maki = require('@mapbox/maki')
const icons = require('@mapbox/maki/icons')
const fs = require('fs')

maki.dirname = '/mapbox-maki-a6d16d4/'

Object.keys(maki.layouts.all.all).forEach(key => {
  console.warn(key)
})
return
maki.layouts.all.all.forEach(icon => {
  console.warn(maki.dirname,icon)
  fs.readFile(maki.dirname + '/icons/' + icon + '-11.svg', 'utf8', function(err, file) {
    // Read icons as strings in node
    // console.log(file)
  })
})
