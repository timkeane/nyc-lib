require('dotenv').config()
const nodeEnv = process.env.NODE_ENV
const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1
const package = require('./package.json')
const name = package.name
const version = package.version

const Client = require('ssh2').Client
const zip = require('zip-folder')

const archiveFile = `${name}-v${version}.zip`
const archiveDir = `${process.env.DEPLOY_DIR}/${name}/archive/`
const deployDir = `${process.env.DEPLOY_DIR}/${name}/${version}/`

console.warn(archiveFile);

zip('dist', `./${archiveFile}`, (err) => {
  if (err) {
      console.log('zip error', err)
      process.exit(1)
  } else {
      console.log('EXCELLENT')
  }
})

// const callback = function(err, stream) {
//   if (err) throw err
//   stream.on('close', function(code, signal) {
//     console.log('Stream :: close :: code: ' + code + ', signal: ' + signal)
//     conn.end()
//   })
// }

// const conn = new Client()

// conn.on('connect', () => {
//   console.log('- connected')
// })
// conn.on('error', (error) => {
//   console.log(`- conection error: ${error}`)
//   process.exit(1)
// })
// conn.on('end', () => {
//   console.log('done!')
//   process.exit(0)
// })

// conn.on('ready', function() {
//   conn.exec(`mkdir -p ${archiveDir}`, callback)
//   conn.exec(`mkdir -p ${deployDir}`, callback)
// })

// conn.connect({
//   host: isProd ? process.env.PRD_SSH_HOST : process.env.STG_SSH_HOST,
//   username: process.env.SSH_USER,
//   privateKey: require('fs').readFileSync(process.env.SSH_KEY_PATH),
//   port: 22
// })
