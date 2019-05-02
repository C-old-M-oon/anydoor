const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const HandleBars = require('handlebars')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir) // 使用promisify解决回调地狱问题
// const config = require('../src/defaultConfig')
const mimeTypes = require('./mime') //获取文件后缀名，判断文件类型进行相应处理

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath, 'utf-8') // 默认readFileSync读取文件结果是一个buffer，添加转码参数转换为一个字符串
const template = HandleBars.compile(source.toString()) // 该方法接收一个字符串进行编译
const compress = require('../helper/compress')
const range = require('../helper/range')
const isFresh = require('../helper/catche')

module.exports = async function(req, res, filePath, config) {
    try {
        const stats = await stat(filePath)
        if (stats.isFile()) {
            // 如果是文件，直接输出所有文件内容
            const contentType = mimeTypes(filePath)
            res.statusCode = 200
            res.setHeader('content-type', 'text/html')

            // 如果有缓存，直接取缓存内容，不返回其他数据
            if (isFresh(stats, req, res)) {
                res.statusCode = 304
                res.end()
                return
            }

            // res.readFile(filePath, (err, data) => {
            //     res.end(data)
            // })
            // 以上方法为读取文件所有内容后再返回文件内容
            //fs.createReadStream(filePath).pipe(res) //创建一个读文件的流，读到一点文件内容就吐出结果
            
            // 读取文件指定范围内容
            let rs
            const { code, start, end } = range(stats.size, req, res)
            if (code === 200) {
                rs = fs.createReadStream(filePath)
            } else {
                rs = fs.createReadStream(filePath, {
                    start, end
                })
            }

            // 对文件进行压缩
            // let rs = fs.createReadStream(filePath)
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res)
            }
            rs.pipe(res)
        } else if (stats.isDirectory()) {
            // 如果是文件夹，则打印出文件夹下所有文件名
            const files = await readdir(filePath)
            res.setHeader('content-type', 'text/html')
            const dir = path.relative(config.root, filePath)
            const data = {
                title: path.basename(filePath),
                files,
                dir: dir && `/${dir}` || '',
            }
            res.statusCode = 200
            // res.end(files.join(','))
            res.end(template(data))
        }
    } catch (error) {
        res.statusCode = 404
        res.setHeader('content-type', 'text/plain')
        res.end(`${filePath} is not a directory`)
    }
}