'use strict'
import { default as debug } from 'debug'
import Promise from 'bluebird'
import moment from 'moment'
import _ from 'lodash'

const log = debug('player:playlist')
global.Promise = Promise

module.exports = function(Playlist) {

  Playlist.createFakePlaylist = function (faker) {
    return Event.create({
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      image: `${faker.image.imageUrl()}/nightlife/${(Math.random() * 9 | 0)}`,
    })
  }

  Playlist.addToQueue = function(track, cb) {
    Playlist.findOnePromised({
      order: 'index DESC',
      limit: 1
    })
    .then((lastTrack) => {
      if (!lastTrack) lastTrack = {
        index: 0,
        endTime: new Date()
      }
      log('lastTrack', lastTrack)
      let playlistToCreate = {
        index: lastTrack.index + 1,
        startTime: lastTrack.endTime,
        endTime: addSecound(lastTrack.endTime, track.duration),
        name: track.name,
        trackId: track.id
      }
      log('creating', playlistToCreate)
      return Playlist.create(playlistToCreate)
    })
    .then((upserted) => {
      return cb(null, upserted)
    })
    .catch(cb)

    function addSecound(date, duration) {
      return moment(date).add(duration, 'seconds').toDate()
    }
  }

  Playlist.getTrack = (index, cb) => {
    return Playlist.findOne({
      where: { index },
      include: ['track']
    }, cb)
  }

  Playlist.observe('before save', (ctx, next) => {
    log('before save | ctx', _.keys(ctx))
    log('before save | instance', Object.getOwnPropertyNames(ctx.instance), ctx.instance instanceof Playlist, _.omit(ctx, 'Model'))

    // nextTrack = Promise.promisify(ctx.instance.nextTrack, { context: ctx })

    if (ctx.instance) {

      Playlist.getTrackPromised(ctx.instance.id + 1)
        .then((nextTrack) => {
          if (nextTrack) {
            if (ctx.instance.endTime !== nextTrack.startTime) {
              log('nextTrack !== current', ctx.instance.endTime !== nextTrack.startTime)
              nextTrack.startTime = ctx.instance.endTime
              nextTrack.endTime = ctx.instance.endTime + nextTrack.track().duration
            }
          }
          next()
          // return nextTrack.save();
        })
        .catch((err) => {
          debug('error', err)
          next(err)
        })
    } else {
      next()
    }
  })

  Promise.promisifyAll(Playlist, { suffix: 'Promised' })

}
