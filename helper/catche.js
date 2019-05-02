const { cache } = require('../src/defaultConfig')
function refreshRes(stats, res) {
    const { maxAge, expires, cacheControl, lastModified, etag } = cache
    if (expires) {
        // 设置缓存时间
        res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString())
    }
    if (cacheControl) {
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
    }
    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString())
    }
    if (etag) {
        res.setHeader('ETag', `${stats.size}-${stats.mtime}`)
    }
}

module.exports = function isFresh(stats, req, res) {
    // 判断是否使用缓存资源
    refreshRes(stats, res)
    const lastModified = req.headers['if-modified-since']
    const etag = req.headers['if-none-match']
    if (!lastModified && !etag) {
        return false // 两者都没有，说明是第一次请求
    }
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false
    }
    if(etag && etag !== res.getHeader('ETag')) {
        return false
    }
    return true
}