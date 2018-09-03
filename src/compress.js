const zlib = require('zlib')

module.exports = (rs, req, res) => {
	const gzip = zlib.createGzip();
	const acceptEncoding = req.headers['accept-encoding']
	if(acceptEncoding.match('gzip')) {
		res.setHeader('Content-Encoding', 'gzip')
		rs.pipe(gzip).pipe(res)
	} 
	else if(acceptEncoding.match('deflate')) {
		res.setHeader('Content-Encoding', 'deflate')
		rs.pipe(gzip).pipe(res)
	} 
	else {
		rs.pipe(res)
	}
}

