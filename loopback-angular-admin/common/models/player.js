'use strict'
import mpd from 'mpd'
import { default as debug } from 'debug'
import Promise from 'bluebird'

const log = debug('player:Player')
global.Promise = Promise

module.exports = function(Player) {

  let client = {};
  let state = {
    isPlaying: false
  }

  Player.bootstrap = function(cb) {
    client = mpd.connect({
      port: 6600,
      host: 'localhost',
    })
    client.on('error', (err) => {
      cb(err)
      Player.emit('error', err)
    })

    client.on('ready', () => {
      cb(null, client)
    })

  }

  Player.play = function(cb) {
    client.sendCommand(mpd.cmd('play', []), (err, msg) => {
      if (err) return cb(err)
      Player.emit('play')
      state.isPlaying = true
      return cb(null, msg)
    })
  }

  Player.remoteMethod('play', {
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

  Player.stop = function(cb) {
    client.sendCommand(mpd.cmd('stop', []), (err, msg) => {
      if (err) return cb(err)
      Player.emit('stop')
      state.isPlaying = false
      return cb(null, msg)
    })
  }

  Player.remoteMethod('stop', {
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

  Player.addTrack = function(name, cb) {
    log(`Added ${name} to MPD playlist`)
    client.sendCommand(mpd.cmd('add', [name]), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.getCurrentPlaylist = function() {
    client.sendCommand(mpd.cmd('playlistinfo', []), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.remoteMethod('getCurrentPlaylist', {
    accepts: {
      arg: 'tracks',
      type: 'array'
    }
  })

  Player.clear = function(cb) {
    client.sendCommand(mpd.cmd('clear', []), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.remoteMethod('clear', {
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

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

  Player.getStatus = function(cb) {
    client.sendCommand(mpd.cmd('status', []), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.updateDatabase = function(cb) {
    client.sendCommand(mpd.cmd('update', []), (err, msg) => {
      if (err) return cb(err)
      log('database updated', msg)
      return cb(null, msg)
    })
  }

  Player.getState = function() {
    return state;
  }

  Promise.promisifyAll(Player, { suffix: 'Promised' })
}
