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
  Playlist.currentTrack = null;

  Playlist.now = function (cb) {
    cb(null, Playlist.currentTrack)
  }

  Playlist.remoteMethod('now', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'track',
      root: true,
      type: 'obj'
    }
  })

  Playlist.nextTrack = function (cb) {
    let Player = Playlist.app.models.Player

    Player.nextTrackIndexPromised()
      .then(index => {
        console.log('index', index)
        return Playlist.findOnePromised({ where: { index: index } })
      })
      .then(track => cb(null, track))
      .catch(cb)
  }

  Playlist.remoteMethod('nextTrack', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'track',
      type: 'object'
    }
  })

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

    Playlist.updateAll(where,
      {

        $inc: {
          index: -1
        }



      }, (err, result) => {
        if (err) return cb(err);
        log('result', result)
        cb(null, result)
      })

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

  Playlist.clear = function (cb) {
    let Player = Playlist.app.models.Player

    Player.clearPromised()
      .then(() => {
        log('before destroy')
        return Playlist.destroyAllPromised({}, { skip: true })
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
        tracks[0].playPromised()
          .then(() => cb(null, tracks[0]))
          .catch(cb)
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
    if (scheduleNext) scheduleNext.cancel()
    Player.stopPromised()
      .then(() => {
        return Playlist.findOnePromised({
          where: {
            index: 0
          }
        })
      }).catch(cb)
  }

  Playlist.remoteMethod('stop', {
    returns: {
      arg: 'track',
      type: 'obj'
    }
  })

  Playlist.getIndex = function (cb) {
    Playlist.count({
      index: {
        gte: 0
      }
    }, cb)
  }

  Playlist.prototype.setIndex = function (cb) {
    Playlist.count({
      index: {
        gte: 0
      }
    }, (err, count) => {
      if (err) return cb(err)
      log('set index', count)
      this.index = count
      return cb(null, this)
    })
  }

  Playlist.setTimeForTracks = function (tracks, startTime) {
    let beginingTrack = {
      endTime: startTime
    }
    tracks.reduce((prev, track) => track.setTime(prev), beginingTrack)
    return tracks
  }

  Playlist.setIndexesForTracks = function (tracks, startIndex) {
    tracks.reduce(
      (prev, track) => Object.assign(track, { index: prev.index + 1 }),
      { index: startIndex - 1 }
    )
    return tracks
  }

  Playlist.saveTracks = function (tracks, cb) {
    return Promise.all(tracks)
      .mapSeries(track => track.savePromised())
      .then(tracks => cb(null, tracks))
      .catch(cb)
  }

  Playlist.updateTimeAndIndex = function (tracks, options, cb) {
    let index = options.index
    let startTime = options.startTime
    if (isFinite(index)) tracks = Playlist.setIndexesForTracks(tracks, index)
    if (startTime) tracks = Playlist.setTimeForTracks(tracks, startTime)
    log('updateTimeAndIndex | track updated', tracks)
    return Playlist.saveTracks(tracks, cb)
  }

  Playlist.prototype.setTime = function (prev) {
    return Object.assign(this, {
      startTime: prev.endTime,
      endTime: Playlist.addSecond(prev.endTime, this.duration)
    })
  }

  Playlist.prototype.setTimeFromPrev = function (cb) {
    log('set time for', this)
    Playlist.findOnePromised({
      where: {
        and: [{
          index: {
            gte: 0
          }
        }, {
          index: {
            lt: this.index
          }
        }]
      },
      order: 'index DESC',
      include: 'track'
    })
      .then((lastPlaylistTrack) => {
        log('lastPlaylistTrack', lastPlaylistTrack)
        if (!lastPlaylistTrack || lastPlaylistTrack.endTime < Date.now()) {
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

  Playlist.prototype.play = function (cb) {
    let Player = Playlist.app.models.Player
    let index = this.index

    Player.playPromised(index)
      .then(() => {
        Playlist.emit('playing', this)
        return cb(null, this)
      })
      .catch(cb)
  }
  Playlist.prototype.playNext = function (cb) {
    let Player = Playlist.app.models.Player
    let triggerNext = this.endTime

    if (scheduleNext) scheduleNext.cancel()

    scheduleNext = schedule.scheduleJob(triggerNext, () => {
      Playlist.nextTrackPromised()
        .then((track) => {
          console.log('play next track', track)
          if (!track) {
            console.log('>>> !! QUEUE END')
            return Player.stopPromised()
          } else {
            Playlist.emit('playing', track)
            return this.destroyPromised()
          }
        }).catch((err) => Playlist.emit('error', err))
    })

    if (cb) return cb(null, 'success')
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
    return track.setIndexPromised()
      .then((track) => {
        return track.setTimeFromPrevPromised()
      })
      .catch(next)
  }

  Playlist.observe('before delete', (ctx, next) => {
    if (ctx.options.skip) return next()
    if (ctx.where && ctx.where.id) {
      log('before delete', ctx.where)
      let id = ctx.where.id
      Playlist.findByIdPromised(id)
        .then(track => {
          console.log('track', track)
          ctx.hookState.deletedIndex = track.index
          return Playlist.findOnePromised({ where: { index: track.index - 1 } })
        })
        .then(prev => {
          ctx.hookState.prevTrack = prev
        })
        .catch(next)
        .finally(() => next())
    } else next()
  })

  Playlist.observe('after delete', (ctx, next) => {
    if (ctx.options.skip) return next()
    log('after delete', ctx.where, ctx.hookState)
    if (ctx.hookState && isFinite(ctx.hookState.deletedIndex)) {
      let index = ctx.hookState.deletedIndex
      Playlist.find({
        where: {
          index: {
            gte: index
          }
        }
      }, (err, tracks) => {
        if (err) return next(err)
        log('after delete: update tracks', tracks)
        log('after delete: prev track', ctx.hookState.prevTrack)
        let startTime = ctx.hookState.prevTrack ? ctx.hookState.prevTrack.endTime : new Date
        Playlist.updateTimeAndIndex(tracks, {
          startTime: startTime,
          index: index
        }, next)
      })
    } else
      return next()
  })

  Playlist.on('playing', (playlistTrack) => {
    log('>>> Playling now', playlistTrack)
    log('>>> Next track in: ', playlistTrack.endTime)

    Playlist.currentTrack = playlistTrack

    playlistTrack.playNext()
  })

  Promise.promisifyAll(Playlist, { suffix: 'Promised' })
  Promise.promisifyAll(Playlist.prototype, { suffix: 'Promised' })

  function getDeletedIndex(id, cb) {
    Playlist.findById(id, cb);
  }
}
