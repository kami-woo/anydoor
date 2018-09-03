const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const handlebars = require('handlebars')
const config = require('./config')
const { type } = require('./mime')
const compress = require('./compress')
const cache = require('./cache')

const tplDir = path.join(__dirname, './template/template.tpl')
const source = fs.readFileSync(tplDir)

async function read(req, res) {
  const { url } = req
  if(url === '/favicon.ico') return
  let filePath = path.join(config.root, url)
  try{
    let stats = await stat(filePath)
    if(stats.isFile()) {
      let rs = fs.createReadStream(filePath)
      if(url.match(config.url)) {
        if(cache(stats, req, res)) {
          res.statusCode = 304
          res.end()
          return
        }
        else {
          res.statusCode = 200
          res.setHeader('contentType', type[path.extname(url)])
          compress(rs, req, res)
          return
        }
      }
    }
    else if(stats.isDirectory()) {
      readdir(filePath)
        .then(files => {
          res.writeHead(200, { contentType: 'text/html'})
          let data = {
            files,
            title: path.basename(filePath),
            dir: path.relative(config.root, filePath)
          }
          
          let template = handlebars.compile(source.toString())
          let html = template(data)
          res.end(html)
        })
    }
  } catch(e) {
    console.log(e)
  }
}

exports.read = read
