const http = require('http')
const path = require('path')
const fs = require('fs')
const conf = require('./defaultConfig')
const route = require('../helper/router')
const openUrl = require('../helper/openUrl')

class Server {
    constructor(config) {
        this.conf = {conf, ...config}
    }
    start() {
        const server = http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('content-type', 'text/html')
            // res.write('<html><body>hello http!!!</body></html>')


            const url = req.url
            const filePath = path.join(this.conf.root, url)
            // 使用promisify写法
            route(req, res, filePath, conf)
            // 使用原始方法查看文件/文件夹，如果是文件夹则输出文件夹下所有文件，否则输出文件内容
            // fs.stat(filePath, (err, stats) => {
            //     if (err) {
            //         res.statusCode = 404
            //         res.setHeader('content-type', 'text/plain')
            //         res.end(`${filePath} is not a directory`)
            //         return
            //     }
            //     if (stats.isFile()) {
            //         // 如果是文件，直接输出所有文件内容
            //         res.statusCode = 200
            //         res.setHeader('content-type', 'text/plain')
            //         // res.readFile(filePath, (err, data) => {
            //         //     res.end(data)
            //         // })
            //         // 以上方法为读取文件所有内容后再返回文件内容
            //         fs.createReadStream(filePath).pipe(res) //创建一个读文件的流，读到一点文件内容就吐出结果
            //     } else if (stats.isDirectory()) {
            //         // 如果是文件夹，则打印出文件夹下所有文件名
            //         fs.readdir(filePath, (err, files) => {
            //             res.statusCode = 200
            //             res.setHeader('content-type', 'text/plain')
            //             res.end(files.join(','))
            //         })
            //     }
            // })
        })

        server.listen(this.conf.port, this.conf.hostname, () => {
            console.log('server is running')
            openUrl(`http://${this.conf.hostname}:${this.conf.port}`)
        })
    }
}

module.exports = Server