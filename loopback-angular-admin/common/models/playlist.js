'use strict'
import { default as debug } from 'debug'
import Promise from 'bluebird'
import moment from 'moment'
import _ from 'lodash'
import schedule from 'node-schedule'


const log = debug('player:playlist')
global.Promise = Promise

module.exports = function (Playlist) {

  Playlist.addSecond = (date, duration) => {
    if (!date) throw new Error('date is', date)
    return moment(date).add(duration, 'seconds').toDate()
  }

  Playlist.decIndexFrom = (index, cb) => {
    let where = {
      index: {
        gte: index
      }
    }

    if (index === undefined || typeof index === 'function') {
      where = null;
      cb = index;
    }

    Playlist.findPromised({
      where: where,
      order: 'index ASC'
    }).then((tracks) => {
      tracks = tracks.map((track) => {
        track.index -= 1
        return track
      })
      console.log('check indexes', tracks)
      return tracks
    }).mapSeries((track) => {
      return track.savePromised()
    }).then((tracks) => {
      cb(null, tracks)
    }).catch(cb)
  }

  Playlist.remoteMethod('decIndexFrom', {
    accepts: {
      arg: 'index',
      type: 'number'
    },
    returns: {
      arg: 'tracks',
      type: 'array'
    }
  })

  Playlist.prototype.setTime = function (prev) {
    return Object.assign(this, {
      startTime: prev.endTime,
      endTime: Playlist.addSecond(prev.endTime, this.duration)
    })
  }

  Playlist.prototype.setTimeFromPrev = function (cb) {
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
          lastPlaylistTrack = {
            endTime: new Date
          }
        }
        this.setTime(lastPlaylistTrack)
        log('setTime track:', this)
        cb(null, this)
      })
      .catch((err) => {
        cb(err)
      })
  }

  Playlist.removeTimeAndIndex = function (index, cb) {
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

  Playlist.clear = function (cb) {
    let Player = Playlist.app.models.Player
    let Counter = Playlist.app.models.Counter

    Player.clearPromised()
      .then(() => {
        log('before destroy')
        return Playlist.destroyAllPromised({}, { skip: true })
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

  Playlist.prototype.play = function (cb) {
    let triggerNext = this.endTime;

    let j = schedule.scheduleJob(triggerNext, () => {
      Playlist.findOnePromised({
        where: {
          index: this.index + 1
        }
      }).then((track) => {
        if (!track) Player.emit('stop')
        Playlist.emit('playing', track)
      })
    }).catch(cb)
  }

  Playlist.observe('before save', (ctx, next) => {
    if (ctx.options.skip) return next()
    log('before save | ctx', _.keys(ctx))
    if (ctx.instance && ctx.isNewInstance) {
      log('instance', ctx.instance)
      return updateTrackInfo(ctx.instance, next)
    } else if (ctx.where && ctx.where.index) {
      next()
    } else {
      return next()
    }
  })

  function updateTrackInfo(track, next) {
    let Counter = Playlist.app.models.Counter

    Counter.autoIncIdPromised(track)
      .then((track) => {
        if (!track.startTime || !track.endTime) {
          return track.setTimeFromPrev(next)
        }
        return next()
      })
      .catch(next)
  }

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
      // TODO: find gte than index, decrement indexes, set time for all
      // return updateNextTracks(ctx.hookState.deletedIndex, next)
    }
    return next()
  })

  function updateNextTracks(index, next) {
    let Counter = Playlist.app.models.Counter

    Counter.autoDecIdPromised("Playlist", index)
      .then(() => {
        // return Playlist.removeTimeAndIndexPromised(index)
        return
      })
      .then((result) => {
        console.log('result', result)
        next()
      })
      .catch(next)
  }

  Playlist.on('playing', (playlistTrack) => {
    log('>>> Playling now', playlistTrack)
    if (playlistTrack) {
      playlistTrack.play((err) => console.error(err))
      Playlist.decIndexFrom((err) => console.error(err))
    } else {
      console.error('Queue end')
    }
  })

  Promise.promisifyAll(Playlist, { suffix: 'Promised' })
  Promise.promisifyAll(Playlist.prototype, { suffix: 'Promised' })
}
