// 文件压缩
const { createGzip, createDeflate } = require('zlib')
module.exports = (rs, req, res) => {
    const acceptEncodeing = req.headers['accept-encoding'] // 获取浏览器支持的压缩类型
    if (!acceptEncodeing || !acceptEncodeing.match(/\b(gzip|deflate)\b/)) {
        return
    } else if (acceptEncodeing.match(/\bgzip\b/)) {
        res.setHeader('Content-encoding', 'gzip') // 通知浏览器服务端压缩方式
        return rs.pipe(createGzip())
    } else {
        res.setHeader('Content-encoding', 'deflate')
        return rs.pipe(createDeflate())
    }
}