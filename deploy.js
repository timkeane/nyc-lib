require('dotenv').config()
const nodeEnv = process.env.NODE_ENV
const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1
const Client = require('ssh2').Client
const package = require('./package.json')
const name = package.name
const version = package.version
const archiveDir = `${process.env.DEPLOY_DIR}/${name}/archive/`
const deployDir = `${process.env.DEPLOY_DIR}/${name}/${version}/`

const host = isProd ? process.env.PRD_SSH_HOST : process.env.STG_SSH_HOST
const user = isProd ? process.env.PRD_SSH_USER : process.env.STG_SSH_USER
const keyPath = process.env.SSH_KEY_PATH

console.warn(user,host,keyPath)

const callback = function(err, stream) {
  if (err) throw err
  stream.on('close', function(code, signal) {
    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal)
    conn.end()
  })
}

const conn = new Client()

conn.on('connect', () => {
  console.log('- connected')
})
conn.on('error', (error) => {
  console.log(`- conection error: ${error}`)
})
conn.on('end', () => {
  console.log('done!')
  process.exit(0)
})

conn.on('ready', function() {
  conn.exec(`mkdir -p ${archiveDir}`, callback)
  conn.exec(`mkdir -p ${deployDir}`, callback)
})

conn.connect({
  host: host,
  username: user,
  privateKey: require('fs').readFileSync(keyPath),
  port: 22
})
