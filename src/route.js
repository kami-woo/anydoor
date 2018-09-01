const http = require('http')
const fs = require('fs')
const path = require('path')
const { root } = require('./config')

const server = http.createServer((req, res) => {
  let filePath = path.join(root, req.url)
  // console.log(filePath)
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
        files.forEach((fileName) => {
          res.write(`${fileName}\n`)
        })
        res.end()
      })
    }
  })
  // res.writeHead(200, { 'Content-Type': 'text/plain' })
  // res.end(filePath)
})

server.listen(3000);
