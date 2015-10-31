'use strict';
var mm = require('musicmetadata'),
    path = require('path'),
    logger = require('../../server/logger/winston'),
    fs = require('fs'),
    _ = require('lodash');

var telnet = require('./telnet'),
    m3u = require('./m3u'),
    time = require('../meta/');

// Schedule queue definition
class Schedule {

  constructor () {
    this.dataStore = [];
    this.isLoaded = false;
  }
  get stor () { return this.dataStore }
  get first () { return this.dataStore[0]}
  get last () { return this.dataStore[this.dataStore.length - 1] }
  get loaded () { return this.isLoaded }
  set loaded (bool) { this.isLoaded = bool }

  enqueue (elem) {
    return this.dataStore.push(elem);
  }
  dequeue () {
    return this.dataStore.shift();
  }

  clear () {
    return this.dataStore = [];
  }
  setTime (initTime) {

    this.dataStore.reduce(
      (prev, cur) => {
        cur.startsTime = prev;
        var date = new time.fDate(cur.startsTime);
        cur.fTime = date.hours + ':' + date.minutes;
        return cur.startsTime + cur.duration*1000;
      },
      initTime
    )
    return this.dataStore
  }
}

var schedule = new Schedule();

// Storing current track variable

class Current {
  constructor () {
    this.store = {}
  }

  get current() { return this.store }
  set current(obj) { this.store = obj }
}

var track = new Current();

// Storing next tracks
class Storage {
  constructor() {
    this.daylist = {};
    this.nightlist = {};
    this.lastDaytime = null;
    this.position = 0;
  }
  set nextDay(obj) { this.daylist = obj; }
  set nextNight(obj) { this.nightlist = obj; }
  get playing() { return this.nightlist.playing || this.daylist.playing; }
  get ready() {
    if (time.getDaytime() === 'day')
      return this.nightlist.ready;
    else if (time.getDaytime() === 'night') {
      return this.daylist.ready;
    }
    else
      return null;
  }

  resetCounter() { this.position = 0; this.lastDaytime = null; }
  next(daytime) {
    daytime === this.lastDaytime ? ++this.position : this.position = 0;
    this.lastDaytime = daytime;
    if (this.position > 4) {
      this.position = 4;
    }
    if (daytime === 'day') {

      logger.log('info', 'next track extracted '+ this.daylist.list[this.position] + ' ' + this.position);
      return this.daylist.list[this.position];
    } else if (daytime === 'night') {
      logger.log('info', 'next track extracted '+ this.nightlist.list[this.position] + ' ' + this.position);
      return this.nightlist.list[this.position];
    } else {
      throw error;
    }
  }
}
var storage = new Storage();

module.exports = {
  loadPlaylist,
  next,
  track,
  schedule,
  storage
};

function loadPlaylist() {
  schedule.loaded = false;
  storage.resetCounter();
  var promise = new Promise(function(resolve) {resolve(null)});
  
  promise
  .then(function() {
    return init('day');
  })
  .then(function() {
    return init('night');
  })
  .then(function() {
    return getMetadata(storage.playing);
  })
  .then(function(metadata) {
    schedule.clear();
    schedule.enqueue(metadata);
    track.current = metadata;
    schedule.setTime(time.serverTime());
    schedule.loaded = true;
    logger.log('info', 'schedule initializated with', metadata.artist, ' - ', metadata.title);
  })
  .then(function() {
    next(time.serverTime());
  })
  .catch(function(err) {
    logger.log('error', 'cannot initializate schedule', err);
  })

}

function next(initTime) {
  if (!schedule.loaded) {
    loadPlaylist();
  }
  var scheduleEnd = schedule.last.startsTime + schedule.last.duration*1000;
  var nextDaytime = time.getDaytime(scheduleEnd);
  init(nextDaytime)
    .then(function() {
      var next = storage.next(nextDaytime)
      return next;
    })
    .then(getMetadata)
    .then(function(metadata) {
      schedule.enqueue(metadata);
      schedule.setTime(initTime);
      logger.log('info', metadata.artist, ' - ', metadata.title, ' added');
    })
    .then(function() {
      if (schedule.stor.length < 6) {
        next(initTime);
      } else {
        logger.log('info', 'playlist initializated', JSON.stringify(schedule.stor, null, 4));
      }
    })
    .catch(function(err) {
      logger.log('error', 'next playlist error, reloading', err);
    })
}


// Private methods

function getMetadata(file) {

  var daytime = path.basename(path.resolve(file, '../..'));
  var promise = new Promise(function(resolve, reject) {
    var stream = fs.createReadStream(file);

    stream.on('error', function(err) {
      logger.log('error', 'stream error with file: ', file);
        var info = {
          filename: file,
          artist: 'no meta',
          title: 'no meta',
          duration: null,
          startsTime: null,
          daytime: daytime,
          fTime: null,
          isEvent: false
        };
        resolve(info);
    });
    mm(stream, {duration: true}, function (err, metadata) {
      var info = {
        filename: file,
        artist: metadata.artist.join(''),
        title: metadata.title,
        duration: metadata.duration,
        startsTime: null,
        daytime: daytime,
        fTime: null,
        isEvent: false
      };
      resolve(info);
    });
  });
  return promise;
}

function init(daytime) {
  return telnet.nextTracks(daytime)
    .then(function(files) {
      if (daytime === 'day') {
        storage.nextDay = files;
      } else if (daytime === 'night') {
        storage.nextNight = files;
      }
    })
    .catch(function(err) {
      logger.log('error', 'schdule initialization error', err);
    })
}
