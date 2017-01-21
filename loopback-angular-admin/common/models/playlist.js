'use strict'
import { default as debug } from 'debug'
import Promise from 'bluebird'
import moment from 'moment'
import _ from 'lodash'

const log = debug('player:playlist')
global.Promise = Promise

module.exports = function(Playlist) {

  Playlist.getTrack = (index, cb) => {
    return Playlist.findOne({
      where: { index },
      include: ['track']
    }, cb)
  }

  Playlist.addSecond = (date, duration) => {
    if (!date) throw new Error('date is', date)
    return moment(date).add(duration, 'seconds').toDate()
  }

  Playlist.setQueueInfo = (playlistTrack, cb) => {
    Playlist.findOnePromised({
      where: {
        index: {
          gte: playlistTrack.index || 0
        }
      },
      sort: {
        index: -1
      },
      include: 'track'
    }, { skip: true })
    .then((lastPlaylistTrack) => {
      if (!lastPlaylistTrack) {
        playlistTrack = Object.assign(playlistTrack, {
          index: 0,
          startTime: new Date,
          endTime: Playlist.addSecond(new Date, playlistTrack.track().duration)
        })
      }
      else {
        console.log('playlistTrack.track()', playlistTrack.track, playlistTrack)
        playlistTrack = Object.assign(playlistTrack, {
          index: lastPlaylistTrack.index + 1,
          startTime: lastPlaylistTrack.endTime,
          endTime: Playlist.addSecond(lastPlaylistTrack.endTime, playlistTrack.track().duration)
        })
      }
      log('setQueueInfo track:', playlistTrack)
      cb(null, playlistTrack)
    })
    .catch((err) => {
      cb(err)
    })
  }

  Playlist.observe('before save', (ctx, next) => {
    if (ctx.options.skip) return next()
    log('instance', ctx.instance)
    log('before save | ctx', _.keys(ctx))
    if (ctx.instance) {
      //  Playlist.setQueueInfo(ctx.instance
      return next()

    } else {
      return next()
    }
  })

  Promise.promisifyAll(Playlist, { suffix: 'Promised' })
}
