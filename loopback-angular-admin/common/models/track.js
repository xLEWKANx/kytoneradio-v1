'use strict'
import Promise from 'bluebird'
import _ from 'underscore'
import mm from 'musicmetadata'
import fs from 'fs'

let parser = Promise.promisify(mm)

module.exports = function(Track) {
  Promise.promisifyAll(Track, { suffix: 'Promised' })

  Track.createFakeData = function (faker, count) {
    let name = `track # - ${count}.mp3`
    return Track.create({
      name: name,
      duration: Math.floor(Math.random() * 200),
      path: `storage/${name}`
    })
  }

  Track.prototype.getMeta = function(cb) {
    let readStream = fs.createReadStream(this.path)
    console.log('getting meta for', this.name)
    parser(readStream, { duration: true })
      .then(meta => {

        return this.updateAttributesPromised({
          processed: true,
          duration: meta.duration
        })
      })
      .then(meta => {
        readStream.close()
        console.log(`Track | Added meta to ${this.name}`)
        return cb(null, meta)
      })
      .catch(err => cb(err))
  }

  // Track.getAllMeta = function(cb) {
  //   Track.findPromised({ where: { processed: false } })
  //     .mapSeries(track => {
  //       let getMetaPromised = Promise.promisify(track.getMeta, { context: track })
  //       return getMetaPromised()
  //     })
  //     .then(res => cb(null, res))
  //     .catch(err => cb(err))
  // }

  Track.scanDir = function(cb) {

    let app = Track.app
    let musicStorage = app.models.musicStorage

    let getFiles = Promise.promisify(musicStorage.getFiles, { context: app.musicStorage })
    let trackStorage

    Track.findPromised({})
      .then(tracks => {
        trackStorage = tracks
        return getFiles('music')
      })
      .filter(file => {
        if (!/.mp3$/.test(file.name)) return false
        let stored = _.findWhere(trackStorage, { name: file.name })
        if (stored && stored.processed) return false
        else return true
      })
      .map(file => {
        let trackPath = `${app.get('STORAGE_PATH')}/music/${file.name}`

        return Track.findOrCreatePromised({
          where: { name: file.name }
        }, {
          name: file.name,
          path: trackPath,
          container: file.container,
          processed: false
        })
      })
      .then(res => {
        console.log(`Added ${res.length} new tracks`)
        return res
      })
      .mapSeries(track => {
        let getMetaPromised = Promise.promisify(track.getMeta, { context: track })
        return getMetaPromised()
      })
      .then(res => cb(null, res))
      .catch(err => {
        throw err
      })
  }

  Track.remoteMethod('getMeta', {
    isStatic: false
  })
  Track.remoteMethod('getMeta', {
    isStatic: true
  })
  Track.remoteMethod('scanDir', {
    isStatic: true,
    returns: { arg: 'body', type: 'array', root: true }
  })

}
