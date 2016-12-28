'use strict'
import mpd from 'mpd'
import { default as debug } from 'debug'
import Promise from 'bluebird'

const log = debug('player')
global.Promise = Promise

module.exports = function(Player) {

  let client = {};
  let status = {
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
      status.isPlaying = true
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
      status.isPlaying = false
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
    debug(`Added ${name} to MPD playlist`)
    client.sendCommand(mpd.cmd('add', [name]), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.rebuildPlaylist = function(tracks, cb) {
    let index = 0;
    let Playlist = Player.app.models['Playlist']
    let clear = (isPlaying) => {
      return (isPlaying) ? Player.cropPromised() : Player.clearPromised()
    }
    return clear(true)
      .then(() => Playlist.destroyAllPromised({ index: { gt: 0 } }))
      .then(() => Promise.all(tracks))
      .map(track => Player.addTrackPromised(track.name).then(() => track))
      .map(track => Playlist.addToQueuePromised(track))
      .then(() => Player.playPromised())
      .catch(err => cb(err))
  }

  Player.remoteMethod('rebuildPlaylist', {
    accepts: {
      arg: 'tracks',
      type: 'array'
    }
  })


  Player.crop = function(cb) {
    client.sendCommand(mpd.cmd('delete', ['1:4']), (err, msg) => {
      if (err) return cb(err)
      return cb(null, msg)
    })
  }

  Player.clear = function(cb) {
    client.sendCommand(mpd.cmd('clear', []), (err, msg) => {
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
