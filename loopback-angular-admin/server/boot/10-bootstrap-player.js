'use strict'
import { default as debug } from 'debug'

const log = debug('boot:player')

module.exports = function (app, next) {
  let Player = app.models['Player']
  Player.bootstrap((err, msg) => {
    if (err) return next(err);
    log('Player ready to serve')
    next();
  })
}
