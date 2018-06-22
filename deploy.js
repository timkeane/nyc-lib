const package = require('./package.json')
const name = package.name
const version = `v${package.version}`
const fs = require('fs')

const deploy = () => {
  require('dotenv').config()
  const nodeEnv = process.env.NODE_ENV
  const isProd = ['production', 'prod', 'prd'].indexOf(nodeEnv) > -1

  const Client = require('ssh2').Client
  const archiveDir = `${process.env.DEPLOY_DIR}/${name}/archive/`
  const deployDir = `${process.env.DEPLOY_DIR}/${name}/${version}/`

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
    process.exit(1)
  })
  conn.on('end', () => {
    console.log('done!')
    process.exit(0)
  })
  
  conn.on('ready', function() {
    console.warn(`mkdir -p ${archiveDir}`);
    console.warn(`mkdir -p ${deployDir}`);
    conn.exec(`mkdir -p ${archiveDir}`, callback)
    conn.exec(`mkdir -p ${deployDir}`, callback)
    conn.sftp((err, sftp) => {
      const read = fs.createReadStream(archiveFile)
      const write = sftp.createWriteStream(`${archiveDir}/${archiveFile}`)
      write.on('close', () => {
        console.log(archiveFile, 'transferred to', `${archiveDir}/${archiveFile}`)
        sftp.end()
        // conn.exec(`mv ${deployDir} ${deployDir}.bak`, callback)
        conn.exec(`tar -xvzf ${archiveDir}/${archiveFile} -C ${deployDir}`, callback)
        // conn.exec(`rm -rf ${deployDir}.bak`, (err, stream) => {
        //   callback(err, stream)
        //   conn.end()
        // })
        // conn.end()
        
      })
      read.pipe(write)
    })
  })
  
  conn.connect({
    host: isProd ? process.env.PRD_SSH_HOST : process.env.STG_SSH_HOST,
    username: process.env.SSH_USER,
    privateKey: fs.readFileSync(`${process.env.HOME}/.ssh/id_rsa`),
    port: 22
  })
}

const archiveFile = `${name}-${version}.zip`
const zipdir = require('zip-dir')
zipdir('./dist', {saveTo: './myzip.zip'}, (err, buffer) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
 