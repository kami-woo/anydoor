const http = require('http')
const { read } = require('./read')

const server = http.createServer((req, res) => {
  read(req, res)
})

server.listen(3000);

console.log('anydoor has been started')
