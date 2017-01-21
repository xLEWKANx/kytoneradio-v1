'use strict'
import Promise from 'bluebird'
import _ from 'underscore'
import mm from 'musicmetadata'
import fs from 'fs'
import { default as debug } from 'debug'

const log = debug('player:track')
const MUSIC_EXTENTION_REGEXP = /.mp3$/

module.exports = function(Track) {
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
    log('getting meta for', this)
    mm(readStream, { duration: true }, (err, meta) => {
      let info = (err) ? {
        err: err.toString(),
        processed: false
      } : {
        duration: meta.duration,
        processed: true
      }
      Object.assign(this, info)
      log(`Track | Added meta to ${this.name}`)
      readStream.close()
      return Track.destroyAll({ name: this.name })
        .then(() => cb(null, info))
        .catch(cb)

    })
  }

  Track.remoteMethod('getMeta', {
    isStatic: false
  })

  Track.observe('before save', (ctx, next) => {
    if (ctx.options.skip) return next()
    log('before save | ctx', _.keys(ctx))

    if (ctx.instance && !ctx.instance.processed) {
      ctx.instance.getMeta(next)
    } else {
      next()
    }
  })

  Track.scanDir = function(cb) {
    let db = Track.app.dataSources.db;
    let app = Track.app
    let musicStorage = app.models.musicStorage

    musicStorage.getFilesPromised('music')
      .filter(filterOnlyMusic)
      .then(files => {
        let filenames = files.map(file => file.name)

        return Track.find({
          where: {
            name: {
              inq: filenames
            },
            processed: true
          }
        }).then(processed => {
          let filtered = filterProcessed(processed, files)
          return filtered
        })
      })
      .map(file => {
        let track = fileToTrack(file)
        return Track.createPromised(track)
      })
      .then(res => cb(null, res))
      .catch(err => cb(err))

      function fileToTrack(file){
        let trackPath = `${app.get('STORAGE_PATH')}/music/${file.name}`

        return {
          name: file.name,
          path: trackPath,
          container: file.container,
          processed: false
        }
      }

      function filterOnlyMusic(file, tracks) {
        if (!MUSIC_EXTENTION_REGEXP.test(file.name)) return false
        else return true
      }

      function filterProcessed(processed, files) {
        return files.filter(file => {
          return !processed.some(pFile =>  {
            return pFile.name === file.name
          })
        })
      }
  }

  Track.remoteMethod('scanDir', {
    isStatic: true,
    returns: { arg: 'body', type: 'array', root: true }
  })

  Track.prototype.addToPlaylist = function(position, cb) {
    if (typeof position === 'function') {
      cb = position;
      position = null;
    }
    this.playlist.create({
      index: position,
      name: this.name
    }, cb)
  }

  Track.remoteMethod('addToPlaylist', {
    isStatic: false,
    returns: { arg: 'playlist', type: 'object', root: true }
  })

  Promise.promisifyAll(Track, { suffix: 'Promised' })
  Promise.promisifyAll(Track.prototype, { suffix: 'Promised' })
}
