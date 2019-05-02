module.exports = {
    root: process.cwd(), // 当前启动根路径
    port: 3000,
    hostname: '127.0.0.1',
    compress: /\.(html|js|css)/,
    cache: {
        maxAge: 600, // s为单位，此处为10分钟
        expires: true,
        cacheControl: true, // 两种缓存方式
        lastModified: true,
        etag: true
    }
}