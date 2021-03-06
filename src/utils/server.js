import { VIDEO_PATH } from './constant'
const fs = require('fs')
const http = require('http')
// const url = require('url')
const path = require('path')
export const httpServer = () => {
  const server = http.createServer((req, res) => {
    const pathName = req.url
    const realPath = path.join(VIDEO_PATH, pathName)
    console.log(realPath)
    fs.readFile(realPath, (err, data) => {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain;charset=utf-8'
        })
        res.write('404')
        res.end()
      } else {
        res.writeHead(200, {
          'Content-Type': Buffer.byteLength(data)
        })
        res.write(data)
        res.end('ok')
      }
    })
  })
  server.listen(9000, () => {
    console.log('服务启动了')
  })
}
