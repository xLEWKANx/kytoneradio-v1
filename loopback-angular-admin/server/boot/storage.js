'use strict'
import path from 'path'

const STORAGE_PATH = process.env.STORAGE_PATH || path.resolve('../storage')

module.exports = function (app) {

  // const ds = app.loopback.createDataSource({
  //   connector: require('loopback-component-storage'),
  //   provider: 'filesystem',
  //   root: path.join(__dirname, '../', '../', 'storage'),
  // })
  // const container = ds.createModel('container')

  app.set('STORAGE_PATH', STORAGE_PATH)
  app.models.Track.scanDir((err, result) => {
    if (err) throw err
    console.log('scanned', result.length)
  })
  // app.model(container)

}
