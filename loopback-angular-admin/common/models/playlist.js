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
    log('set time for', this.index)
    Playlist.findOnePromised({
      where: {
        and: [{
          index: {
            gte: 0
          }
        }, {
          index: {
            lte: this.index
          }
        }]
      },
      order: 'index DESC',
      include: 'track'
    }, { skip: true })
    .then((lastPlaylistTrack) => {
      log('lastPlaylistTrack', lastPlaylistTrack)
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

  Playlist.removeTimeAndIndex = function(index, cb) {
    Playlist.findPromised({
      where: {
        index: {
          gte: index
        }
      }
    }).mapSeries((track) => {
      let updatedTrack = Object.assign(track, {
        startTime: null,
        endTime: null,
        index: null
      })
      return updatedTrack.savePromised()
    })
    .then((track) => cb(null, track))
    .catch(cb)
  }

  Playlist.clear = function(cb) {
    let Player = Playlist.app.models.Player
    let Counter = Playlist.app.models.Counter

    Player.clearPromised()
      .then(() => {
        log('before destroy')
        return Playlist.destroyAllPromised({
          index: {
            gte: 1
          }
        }, { skip: true })
      })
      .then((result) => {
        log('destroy', result)
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
    if (ctx.instance) {
      Counter.autoIncIdPromised(ctx.instance)
        .then((instance) => {
          return ctx.instance.setTime(next)
        })
        .catch(next)
    } else if (ctx.where && ctx.where.index) {
      next()
    } else {
      return next()
    }
  })

  Playlist.observe('before delete', (ctx, next) => {
    if (ctx.options.skip) return next()
    if (ctx.where && ctx.where.id) {
      Playlist.findById(ctx.where.id, (err, track) => {
        if (err) next(err)
        log('before delete track', track)
        if (track) {
          ctx.hookState.deletedIndex = track.index
        }
        return next()
      })
    }
  })
  Playlist.observe('after delete', (ctx, next) => {
    if (ctx.options.skip) return next()
    let Counter = Playlist.app.models.Counter
    log('ctx', ctx.where, ctx.hookState, Number.isInteger(ctx.hookState.deletedIndex))
    if (ctx.hookState && Number.isInteger(ctx.hookState.deletedIndex)) {
      return updateNextTracks(ctx.hookState.deletedIndex, next)
    }
    return next()
  })

  function updateNextTracks(index, next) {
    let Counter = Playlist.app.models.Counter

    Counter.autoDecIdPromised("Playlist", index)
      .then(() => {
        return Playlist.removeTimeAndIndexPromised(index)
      })
      .then((result) => {
        console.log('result', result)
        next()
      })
      .catch(next)

  }
  Promise.promisifyAll(Playlist, { suffix: 'Promised' })
  Promise.promisifyAll(Playlist.prototype, { suffix: 'Promised' })
}
