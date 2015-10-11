'use strict';
var mm = require('musicmetadata'),
    path = require('path'),
    logger = require('../../server/logger/winston'),
    fs = require('fs');

var telnet = require('./telnet'),
    meta = require('../meta/');

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
  setTime (time) {

    this.dataStore.reduce(
      (prev, cur) => {
        cur.startsTime = prev;
        var date = new meta.fDate(cur.startsTime);
        cur.fTime = date.hours + ':' + date.minutes;
        return cur.startsTime + cur.duration*1000;
      },
      time
    )
    return this.dataStore
  }
}

var schedule = new Schedule();

// Storing current track variable

class Stor {
  constructor () {
    this.store = {}
  }

  get current() { return this.store }
  set current(obj) { this.store = obj }
}

var track = new Stor();

module.exports = {
  init,
  next,
  current,
  track,
  schedule
};

function init(daytime) {

  telnet.nextTracks(daytime)
    .then(function(files) {
      return Promise.all(files.slice(0, 5).map(getMetadata))
    })
    .then(function(metadata) {
      schedule.clear();
      return Promise.all(metadata.map(elem => schedule.enqueue(elem)))
    })
    .then(function() {
      schedule.setTime(meta.serverTime());
      logger.log('info', 'schdule initializated with last track ', schedule.last);
    })
    .catch(function(err) {
      logger.log('error', 'schdule initialization error', err);
    })
}

function next(current) {
  var scheduleEnd = schedule.last.startsTime + schedule.last.duration*1000;
  var daytime = meta.getDaytime(scheduleEnd);

  // Get next tracks
  telnet.nextTracks(daytime)
    .then(function(result){
      var ended = schedule.dequeue();

      logger.log('\nended: ', ended);
      
      if (daytime === meta.getDaytime()) {
        return result[5];
      }
      else {
        return result[0];
      }
    })
    .then(getMetadata)
    .then(function(metadata) {
      logger.log('info', 'next track: ', meta.artist, '-', meta.title, ' from ',
      daytime, 'playlist');
      schedule.enqueue(metadata);
      schedule.setTime(Date.parse(current.on_air));
    })
    .then(function() { // CRUTCH!!! need fix initialization;
      if (daytime !== meta.getDaytime(schedule.first.startsTime)) {
        init(meta.getDaytime(schedule.first.startsTime));
      }
    })
    .catch(function (err) {
      logger.log('error', 'getting next track error', err);
    })
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
          fTime: null,
          isEvent: false
        }
        resolve(info);
      }
    });
  });
  return promise;
}
