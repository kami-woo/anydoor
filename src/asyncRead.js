const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const handlebars = require('handlebars')
const { root } = require('./config')
// const mime = require('./mime')
const { type } = require('./mime')

const tplDir = path.join(__dirname, './template/template.tpl')
const source = fs.readFileSync(tplDir)

async function read(req, res) {
  const { url } = req
  if(url === '/favicon.ico') return
  let filePath = path.join(root, url)
  try{
    let stats = await stat(filePath)
    if(stats.isFile()) {
      res.writeHead(200, { contentType: type[path.extname(url)]})
      fs.createReadStream(filePath).pipe(res)
    }
    if(stats.isDirectory()) {
      readdir(filePath)
        .then(files => {
          res.writeHead(200, { contentType: 'text/html'})
          let data = {
            files,
            title: path.basename(filePath),
            dir: path.relative(root, filePath)
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
