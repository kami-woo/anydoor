const { cacheTypes } = require('./config')


const cache = (stats, res) => {
	const time = new Date(Date.now() + cacheTypes.max_age*1000)

	if(cacheTypes.expires) {
		res.setHeader('Expires', time.toUTCString())
	}

	if(cacheTypes.cacheControl) {
		res.setHeader('Cache-Control', cacheTypes.max_age)
	}
	
	if(cacheTypes.ifModified) {
		res.setHeader('Last-Modified', stats.mtime.toUTCString())
	}
	
	if(cacheTypes.etag) {
		res.setHeader('ETag', `${stats.size}`)
	}
}

module.exports = (stats, req, res) => {
	cache(stats, res)

	const last_Modified = res.getHeader('Last-Modified')
	const etag = res.getHeader('ETag')

	const if_None_Match = req.headers['if-none-match']
	const if_Modified_Since = req.headers['if-modified-since']
	
	if(!if_None_Match && !if_Modified_Since) {
		return false
	}
	else if(etag) {
		return etag === if_None_Match
	}
	else {
		return last_Modified === if_Modified_Since
	}
}
