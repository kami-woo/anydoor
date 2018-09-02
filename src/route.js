const http = require('http')
const { read } = require('./asyncRead')

const server = http.createServer((req, res) => {
  read(req, res)
})

server.listen(3000);

console.log('anydoor has been started')
