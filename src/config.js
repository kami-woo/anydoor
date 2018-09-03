const { cwd } = require('process')

module.exports = {
  root: cwd(),
  compress: /(js||css||html||txt)/,
  cacheTypes: {
    max_age: 60,
    cacheControl: false,
    etag: true,
    ifModified: true,
    expires: false
  }
}