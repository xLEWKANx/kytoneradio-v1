'use strict';
var mm = require('musicmetadata'),
    path = require('path'),
    logger = require('../../server/logger/winston'),
    fs = require('fs'),
    _ = require('lodash');

var telnet = require('./telnet'),
    time = require('../meta/');

// Schedule queue definition
class Schedule {

  constructor () {
    this.dataStore = [];
  }
  get stor () { return this.dataStore }
  get first () { return this.dataStore[0]}
  get last () { return this.dataStore[this.dataStore.length - 1]
  }

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
  }
  set nextDay(obj) {
    this.daylist = obj;
  }
  set nextNight(obj) {
    this.nightlist = obj;
  }
  get nextDay() {
    return this.daylist;
  }
  get nextNight() {
    return this.nightlist;
  }
  get playing() {
    return this.nightlist.playing || this.daylist.playing;
  }
}
var storage = new Storage();

module.exports = {
  loadPlaylist,
  next,
  current,
  track,
  schedule
};

function loadPlaylist() {

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
    schedule.setTime(time.serverTime());
    logger.log('info', 'schedule initializated with', metadata.artist, ' - ', metadata.title);
  })
  .then(function() {
    next(0, time.serverTime());
  })
  .catch(function(err) {
    logger.log('error', 'cannot initializate schedule', err);
  })

}

function next(position, initTime) {
  var scheduleEnd = schedule.last.startsTime + schedule.last.duration*1000;
  var daytime = time.getDaytime(scheduleEnd);
  init(daytime)
    .then(function() {
      if (daytime === 'day') {
        return storage.nextDay.list[position];
      }
      else if (daytime === 'night') {
        return storage.nextNight.list[position];
      }
    })
    .then(getMetadata)
    .then(function(metadata) {
      schedule.enqueue(metadata);
      logger.log('info', metadata.artist, ' - ', metadata.title, ' added');
      schedule.setTime(initTime);
    })
    .then(function() {
      if (schedule.stor.length != 5) {
        var newScheduleEnd = schedule.last.startsTime + schedule.last.duration*1000;
        //recursive add tracks to related date

        if (daytime !== time.getDaytime(newScheduleEnd)) {
          position = 0;
        }
        console.log(position);
        next(position+1, initTime)
      }
    })
    .catch(console.log)
}

function current() {
  return track.current;
}

function getSchedule() {
  return schedule.stor;
}

// Private methods

function getMetadata(file, index) {
  var daytime = path.basename(path.resolve(file, '../..'));

  var promise = new Promise(function(resolve, reject) {
    var stream = fs.createReadStream(file);

    stream.on('error', function(err) {
      reject(err);
    });
    mm(stream, {duration: true}, function (err, metadata) {
      if (err) {
        logger.log('error', 'cannot read ', file);
        reject(err);
      } else {
        var info = {
          filename: file,
          artist: metadata.artist.join(''),
          title: metadata.title,
          duration: metadata.duration,
          startsTime: null,
          daytime: daytime,
          fTime: null,
          isEvent: false
        }
        resolve(info);
      }
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
