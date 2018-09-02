const http = require('http')
const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const { root } = require('./config')

const tplDir = path.join(__dirname, './template/template.tpl')
const source = fs.readFileSync(tplDir)
// console.log(path.resolve('./template/template.tpl'))

const server = http.createServer((req, res) => {
  let filePath = path.join(root, req.url)
  fs.stat(filePath, (err, stats) => {
    if(err) {
      res.writeHead(404, { contentType: 'text/plain' })
      res.end('文件路径不存在')
    }
    if(stats.isFile()) {
      // fs.readFileStream('filePath').pipe
      fs.readFile(filePath, (err, content) => {
        res.writeHead(200, { contentType: 'text/html'})
        res.end(content)
      })
    }
    if(stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.writeHead(200, { contentType: 'text/html'})
        // files.forEach((fileName) => {
        //   res.write(`${fileName}\n`)
        // })
        let data = {
          files,
          title: path.basename(filePath),
          dir: filePath
        }
        
        let template = handlebars.compile(source.toString())
        let html = template(data)
        // console.log(html)
        res.end(html)
      })
    }
  })
})

server.listen(3000);

console.log('anydoor has been started')
