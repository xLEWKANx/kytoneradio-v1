'use strict'
import { default as debug } from 'debug'
import Promise from 'bluebird'
import moment from 'moment'
import _ from 'lodash'
import schedule from 'node-schedule'


const log = debug('player:playlist')
global.Promise = Promise

module.exports = function (Playlist) {

  let scheduleNext

  Playlist.createFakeTracks = function (count) {
    let Track = Playlist.app.models.Track;

    const TRACK_DURATION = 60;

    const MOCK_TRACK = new Track({
      id: 0,
      name: 'test track',
      processed: true,
      duration: TRACK_DURATION
    })

    let playlist = [];
    let startTime = new Date()

    for (let i = 0; i < count; i++) {
      let endTime = Playlist.addSecond(startTime, TRACK_DURATION)

      let MOCK_PLAYLIST_TRACK = new Playlist({
        id: i,
        name: 'test playlist track',
        startTime: startTime,
        endTime: endTime,
        duration: TRACK_DURATION,
        trackId: 0,
        index: i
      })

      startTime = endTime

      MOCK_PLAYLIST_TRACK.track(MOCK_TRACK)
      playlist.push(MOCK_PLAYLIST_TRACK)
    }
    return playlist;
  }

  Playlist.addSecond = (date, duration) => {
    if (!date) throw new Error(`date is ${date}`)
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

  Playlist.play = function (cb) {
    Playlist.find({
      where: {
        index: {
          gte: 0
        }
      }
    }, (err, tracks) => {
      if (err || !tracks.length) cb(new Error('Playlist.play | Cannot find track with index 0'))
      Playlist.setTimeForTracks(tracks, new Date, (err, tracks) => {
        if (err) return cb(err)
        tracks[0].play()
        return cb(null, tracks[0])
      })
    })
  }

  Playlist.remoteMethod('play', {
    returns: {
      arg: 'track',
      type: 'object'
    }
  })

  Playlist.stop = function (cb) {
    let Player = Playlist.app.models.Player;
    Player.stop()
    if (scheduleNext) scheduleNext.cancel()
    Playlist.findOne({
      where: {
        index: 0
      }
    }, cb)
  }

  Playlist.remoteMethod('stop', {
    returns: {
      arg: 'track',
      type: 'obj'
    }
  })

  Playlist.setTimeForTracks = function (tracks, startTime, cb) {
    let beginingTrack = {
      endTime: startTime
    }
    tracks.reduce((prev, track) => track.setTime(prev), beginingTrack)
    let promises = tracks.map(track => track.save())
    return Promise.all(promises).then((tracks) => cb(null, tracks)).catch(cb)
  }

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

  Playlist.prototype.play = function () {
    let Player = Playlist.app.models.Player
    let triggerNext = this.endTime;

    Player.play()

    scheduleNext = schedule.scheduleJob(triggerNext, () => {
      Playlist.findOnePromised({
        where: {
          index: 1
        }
      }).then((track) => {
        console.log('play next track', track)
        if (!track) {
          return Player.stopPromised()
        } else {
          Playlist.emit('playing', track)
        }
      }).catch((err) => Playlist.emit('error', err))
    })
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

  Playlist.playSequence = function (playlistTrack) {

  }

  Playlist.on('playing', (playlistTrack) => {
    log('>>> Playling now', playlistTrack)
    log('>>> Next track in: ', playlistTrack.endTime)
    if (playlistTrack) {
      Playlist.decIndexFromPromised().then(() => {
        playlistTrack.play()
      }).catch((err) => {
        console.log('on playing error', err)
        throw err;
      })
    } else {
      console.error('Queue end')
    }
  })

  Promise.promisifyAll(Playlist, { suffix: 'Promised' })
  Promise.promisifyAll(Playlist.prototype, { suffix: 'Promised' })
}
