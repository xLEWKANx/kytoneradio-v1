'use strict'
import { default as debug } from 'debug'

const log = debug('player:boot')

module.exports = function (app, next) {
  let Player = app.models['Player']
  let Counter = app.models['Counter']

  Player.bootstrapPromised((msg) => {
    return Counter.initAutoInc('Playlist', next)
  })
  .catch((err) => {
    next(err);
  })

}
