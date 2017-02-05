'use strict'
import { default as debug } from 'debug'
import Promise from 'bluebird'

const log = debug('player:boot')

module.exports = function (app, next) {
  let Player = app.models['Player']
  let Playlist = app.models['Playlist']
  let Counter = app.models['Counter']

  Player.bootstrap((err, msg) => {
    if (err) next(err)
    Promise.props({
      clear: Player.clearPromised(),
      tracks: Playlist.find({
        where: {
          index: {
            gte: 0
          }
        },
        order: 'index ASC'
      })
    })
      .then((res) => {
        let promises = res.tracks.map((track) => Player.addTrackPromised(track.name))
        return Promise.all(promises).then(() => res.tracks)
      })
      .then((tracks) => {
        Player.play(() => { });
        return Counter.initAutoIncPromised('Playlist').then(() => tracks)
      })
      .then((tracks) => {
        let beginingTrack = {
          endTime: new Date
        }
        tracks.reduce((prev, track) => track.setTime(prev), beginingTrack)
        let promises = tracks.map(track => track.save())
        return Promise.all(promises)
      })
      .then((tracks) => {
        log('tracks', tracks)
        if (tracks.length) Playlist.emit('playing', tracks[0]);
        next()
      })
      .catch((err) => {
        console.error('Bootstrap mpd error:', err)
        next(err);
      })
  })
}
