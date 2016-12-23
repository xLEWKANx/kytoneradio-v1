'use strict'
import mpd from 'mpd'
import { default as debug } from 'debug'
import Promise from 'bluebird'

const log = debug('player')

module.exports = function(Player) {

  let client = {};

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
      return cb(null, msg)
    })
  }

  Player.remoteMethod('stop', {
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

  Player.addTrack = function(track, cb) {
    console.log('tracks', track)
    client.sendCommand(mpd.cmd('add', [track]), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.addTracks = function(tracks, cb) {
    console.log('tracks', tracks)
    return Promise.all(tracks)
      .map(track => Player.addTrackPromised(track))
      .catch(err => cb(err))
  }

  Player.remoteMethod('addTracks', {
    accepts: {
      arg: 'tracks',
      type: 'array'
    }
  })


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

  Player.getStatus = function(cb) {
    client.sendCommand(mpd.cmd('status', []), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Promise.promisifyAll(Player, { suffix: 'Promised' })
}
