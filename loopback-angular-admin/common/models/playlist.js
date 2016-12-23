'use strict'
import { default as debug } from 'debug'
import Promise from 'bluebird'

const log = debug('player:playlist')
global.Promise = Promise

module.exports = function(Playlist) {

  Playlist.addToQueue = function(track, cb) {
    Playlist.findOnePromised({
      where: {
        index: { gt: 0 }
      },
      order: 'index DESC'
    })
    .then((lastTrack) => {
      if (!lastTrack) lastTrack = {
        index: -1,
        endTime: Date.now()
      }
      return Playlist.upsert({
        index: lastTrack.index + 1,
        startTime: lastTrack.endTime,
        endTime: lastTrack.endTime + track.duration,
        name: track.name,
        trackId: track.id
      })
    })
    .then(() => {
      return cb(null, null)
    })
    .catch(cb)
  }

  Promise.promisifyAll(Playlist, { suffix: 'Promised' })

}
