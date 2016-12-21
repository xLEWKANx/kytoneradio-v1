'use strict'
import mpd from 'mpd'

module.exports = function(Player) {

  let client;

  Player.bootstrap = function(cb) {
    client = mpd.connect({
      port: 6600,
      host: 'localhost',
    })
    client.on('error', (err) => {
      cb(err)
      Player.emit('error', err)
    })
    client.on('system', (system) => {
      console.log('system', system)
    })

    client.on('system-player', (system) => {
      console.log('system-player', system)
    })

    client.on('ready', () => {

      cb(null, client)
    })

  }

  Player.play = function(cb) {
    client.sendCommand(mpd.cmd('play', []), (err, msg) => {
      if (err) return cb(err)
      Player.emit('play')
      cb(null, msg)
    })
  }

  Player.stop = function(cb) {
    client.sendCommand(mpd.cmd('stop', []), (err, msg) => {
      if (err) return cb(err)
      Player.emit('stop')
      return cb(null, msg)
    })
  }

  Player.addTracks = function(tracks, cb) {
    client.sendCommand(mpd.cmd('add', tracks), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.crop = function(cb) {
    client.sendCommand(mpd.cmd('crop', []), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.removeTrack = function(position, cb) {
    client.sendCommand(mpd.cmd('delete', position), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.moveTrack = function(from, to, cb) {
    client.sendCommand(mpd.cmd('move', [from, to]), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }
}
