'use strict'
import pug from 'pug'
import path from 'path'

const viewsDir = '../../src/client/views/'

module.exports = function (server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router()
  router.get('/status', server.loopback.status())

  router.get('/', (req, res, next) => {
    let homePath = path.join(__dirname, viewsDir, 'index.pug')
    let rendererFn = pug.compileFile(homePath)

    res.write(rendererFn({
      title: 'kytoneradio',
      timenow: 'meta.viewTime()',
      brands: []
    }))
    res.end()
    next()
  })

  router.get('/views/:page', (req, res, next) => {
    let homePath = path.join(__dirname, viewsDir, `${req.params.page}.pug`)
    let rendererFn = pug.compileFile(homePath)

    res.write(rendererFn({}))
    res.end()
    next()
  })
  server.use(router)
}
