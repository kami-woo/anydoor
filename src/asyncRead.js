const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const handlebars = require('handlebars')
const { root } = require('./config')

const tplDir = path.join(__dirname, './template/template.tpl')
const source = fs.readFileSync(tplDir)

async function read(req, res) {
  const { url } = req
  if(url === '/favicon.ico') return
  let filePath = path.join(root, url)

  try{
    let stats = await stat(filePath)
    if(stats.isFile()) {
      res.writeHead(200, { contentType: 'text/html'})
      fs.createReadStream(filePath).pipe(res)
      // res.end()
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
