'use strict'
import { default as debug } from 'debug'

const log = debug('player')

module.exports = function (app, next) {
  let Player = app.models['Player']
  let Counter = app.models['Counter']

  Player.bootstrapPromised((msg) => {
    console.log('Player ready to serve')
    return Counter.initAutoInc('Playlist', next)
  })
  .catch((err) => {
    next(err);
  })

}
