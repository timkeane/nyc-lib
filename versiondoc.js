const fs = require('fs')

fs.readFile('./package.json', (err, json) => {
  if (err) return console.error(err)
  const version = JSON.parse(json).version
  const doc = './dist/doc/index.html'
  fs.readFile(doc, 'utf8', (err, data) => {
    if (err) return console.error(err)
    const versionedDoc = data.replace(/@@VERSION@@/g, `v${version}`)
    fs.writeFile(doc, versionedDoc, 'utf8', err => {
       if (err) return console.log(err)
    })
  })  
})
