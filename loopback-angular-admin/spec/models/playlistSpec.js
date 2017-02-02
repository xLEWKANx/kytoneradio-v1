/* eslint-env jasmine, node */

describe('Playlist test', () => {

  let Promise = require('bluebird')
  let moment = require('moment')
  let app = require('../../server/server')
  let Playlist = app.models.Playlist
  let Player = app.models.Player

  Player.addTrackPromised = function(name, cb) {
    return Promise.resolve()
  }

  global.Promise = Promise

  let db = app.loopback.createDataSource('db', { connector: 'memory'})

  Playlist.attachTo(db)

  let firstTrack, secondTrack, thirdTrack

  it('should add track to the end of the queue', (done) => {
    done();
    let track = {
      name: "test track",
      duration: 30 * 60,
      path: "test.mp3",
      processed: "true"
    }

    Playlist.addToQueuePromised(track)
      .then((upsertedTrack) => {
        expect(upsertedTrack.index).toBe(1)
        expect(formatDate(upsertedTrack.startTime)).toEqual(formatDate(new Date))
        expect(formatDate(upsertedTrack.endTime)).toEqual(addSecound(upsertedTrack.startTime, track.duration))
        console.log('upsertedTrack', upsertedTrack instanceof Playlist )
        firstTrack = upsertedTrack
        return Playlist.addToQueuePromised(track)
      })
      .then((upsertedTrack) => {
        expect(upsertedTrack.index).toBe(2)
        expect(formatDate(upsertedTrack.startTime)).toEqual(formatDate(firstTrack.endTime))
        expect(formatDate(upsertedTrack.endTime)).toEqual(addSecound(upsertedTrack.startTime, track.duration))
        secondTrack = upsertedTrack
        return Playlist.addToQueuePromised(track)
      })
      .then((upsertedTrack) => {
        expect(upsertedTrack.index).toBe(3)
        expect(formatDate(upsertedTrack.startTime)).toEqual(formatDate(secondTrack.endTime))
        expect(formatDate(upsertedTrack.endTime)).toEqual(addSecound(upsertedTrack.startTime, track.duration))
        thirdTrack = upsertedTrack
        return done()
      })
      .catch((err) => {
        console.log('error', err)
        expect(err).not.toBeDefined()
        return done()
      })

    function addSecound(date, duration) {
      return moment(date).add(duration, 'seconds').format('YY-MM-DD HH:mm:ss')
    }

    function formatDate(date) {
      return moment(date).format('YY-MM-DD HH:mm:ss')
    }
  })

})
