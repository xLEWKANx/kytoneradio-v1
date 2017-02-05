'use strict'
import mpd from 'mpd'
import { default as debug } from 'debug'
import Promise from 'bluebird'

const log = debug('player:Player')
global.Promise = Promise

module.exports = function (Player) {

  let client = {};
  let state = {
    isPlaying: false
  }
  Player.on('error', (err) => {
    throw new Error('Mpd problem', err)
  })

  Player.bootstrap = function (cb) {
    client = mpd.connect({
      port: 6600,
      host: 'localhost',
    })
    client.on('error', (err) => {
      cb(err)
      Player.emit('error', err)
    })

    client.on('ready', () => {
      console.log('ready')
      cb(null, client)
    })

  }

  Player.play = function (cb) {
    client.sendCommand(mpd.cmd('play', []), (err, msg) => {
      if (err) return cb(err)
      Player.emit('play')
      state.isPlaying = true
      Player.log({
        command: 'play'
      }, cb)
    })
  }

  Player.remoteMethod('play', {
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

  Player.stop = function (cb) {
    client.sendCommand(mpd.cmd('stop', []), (err, msg) => {
      if (err) return cb(err)
      Player.emit('stop')
      state.isPlaying = false
      Player.log({
        command: 'stop'
      }, cb)
    })
  }

  Player.remoteMethod('stop', {
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

  Player.addTrack = function (name, cb) {
    client.sendCommand(mpd.cmd('add', [name]), (err, msg) => {
      if (err) return cb(err)
      log(`Added ${name} to MPD playlist`, err, msg)
      Player.log({
        command: 'play',
        messange: name
      }, cb)
    })
  }

  Player.getCurrentPlaylist = function (cb) {
    client.sendCommand(mpd.cmd('playlistinfo', []), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.remoteMethod('getCurrentPlaylist', {
    returns: {
      arg: 'tracks',
      type: 'string'
    }
  })

  Player.clear = function (cb) {
    client.sendCommand(mpd.cmd('clear', []), (err, msg) => {
      if (err) return cb(err)
      Player.log({
        command: 'clear'
      }, cb)
    })
  }

  Player.remoteMethod('clear', {
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

  Player.removeTrack = function (position, cb) {
    client.sendCommand(mpd.cmd('delete', position), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.moveTrack = function (from, to, cb) {
    client.sendCommand(mpd.cmd('move', [from, to]), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.getStatus = function (cb) {
    client.sendCommand(mpd.cmd('status', []), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.remoteMethod('getStatus', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'status',
      type: 'string'
    }
  })

  Player.updateDatabase = function (cb) {
    client.sendCommand(mpd.cmd('update', []), (err, msg) => {
      if (err) return cb(err)
      log('database updated', msg)
      return cb(null, msg)
    })
  }

  Player.getState = function () {
    return state;
  }

  Player.log = function (info, cb) {
    if (typeof error === 'function') {
      cb = error
      error = null
    }
    let log = Object.assign({
      timestamp: new Date()
    }, info)
    Player.create(log, cb)
  }

  Promise.promisifyAll(Player, { suffix: 'Promised' })
}
