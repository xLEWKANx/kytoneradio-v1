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

  Playlist.prototype.setTime = function(cb) {
    Playlist.findOnePromised({
      where: {
        index: {
          gte: 0
        }
      },
      order: 'index DESC',
      include: 'track'
    }, { skip: true })
      .then((lastPlaylistTrack) => {
      console.log('lastPlaylistTrack', lastPlaylistTrack)
      if (!lastPlaylistTrack) {
        Object.assign(this, {
          startTime: new Date,
          endTime: Playlist.addSecond(new Date, this.duration)
        })
      }
      else {
        Object.assign(this, {
          startTime: lastPlaylistTrack.endTime,
          endTime: Playlist.addSecond(lastPlaylistTrack.endTime, this.duration)
        })
      }
      log('setTime track:', this)
      cb(null, this)
    })
    .catch((err) => {
      cb(err)
    })
  }

  Playlist.clear = function(cb) {
    let Player = Playlist.app.models.Player
    let Counter = Playlist.app.models.Counter

    Player.clearPromised()
      .then(() => {
        return Playlist.destroyAll({
          index: {
            gte: 0
          }
        })
      })
      .then((result) => {
        return Counter.resetPromised('Playlist')
      })
      .then((result) => {
        log('Playlist clear', result)
        cb(null, result)
      })
      .catch((err) => {
        cb(err)
      })
  }

  Playlist.remoteMethod('clear', {
    returns: {
      arg: 'log',
      type: 'object'
    }
  })

  Playlist.observe('before save', (ctx, next) => {
    let Counter = Playlist.app.models.Counter

    if (ctx.options.skip) return next()
    log('instance', ctx.instance)
    log('before save | ctx', _.keys(ctx))
    if (ctx.instance && ctx.isNewInstance) {
      Counter.autoIncIdPromised(ctx.instance)
        .then((instance) => {
          return ctx.instance.setTime(next)
        })
        .catch(next)
    } else {
      return next()
    }
  })

  Playlist.observe('before delete', (ctx, next) => {
    let Counter = Playlist.app.models.Counter
    Counter.autoDecId("Playlist", next)

  })

  Promise.promisifyAll(Playlist, { suffix: 'Promised' })
  Promise.promisifyAll(Playlist.prototype, { suffix: 'Promised' })
}
