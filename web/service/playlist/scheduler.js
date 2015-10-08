'use strict';
var mm = require('musicmetadata'),
    path = require('path'),
    logger = require('../../server/logger/winston'),
    fs = require('fs');

var telnet = require('./telnet'),
    time = require('../meta/');

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
        return cur.startsTime + cur.duration*1000;
      },
      time
    )
    return this.dataStore
  }
}
var schedule = new Schedule();

module.exports = {
  init,
  next,
  getSchedule
};

function init(daytime) {

  telnet.nextTracks(daytime)
    .then(function(files) {
      return Promise.all(files.slice(0, 5).map(getMetadata))
    })
    .then(function(meta) {
      schedule.clear();
      return Promise.all(meta.map(elem => schedule.enqueue(elem)))
    })
    .then(function() {
      schedule.setTime(time.serverTime());
      logger.log('info', 'schdule initializated with last track ', schedule.last);
    })
    .catch(function(err) {
      logger.log('error', 'schdule initialization error', err);
    })
}

function next(current) {
  var scheduleEnd = schedule.last.startsTime + schedule.last.duration*1000;
  var daytime = time.getDaytime(scheduleEnd);
  telnet.nextTracks(daytime)
    .then(function(result){
      var ended = schedule.dequeue();
      logger.log('\nended: ', ended);
      if (daytime === time.getDaytime()) {
        return result[5];
      }
      else {
        return result[0];
      }
    })
    .then(getMetadata)
    .then(function(meta) {
      logger.log('info', 'next track: ', meta.artist, '-', meta.title, ' from ',
      daytime, 'playlist');
      schedule.enqueue(meta);
      schedule.setTime(Date.parse(current.on_air));
    })
    .then(function() { // CRUTCH!!! need fix initialization;
      if (daytime === time.getDaytime(schedule.first.startsTime)) {
        init(daytime);
      }
    })
    .catch(function (err) {
      logger.log('error', 'getting next track error', err);
    })
  
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
    mm(stream, {duration: true}, function (err, meta) {
      if (err) {
        logger.log('error', 'cannot read ', file);
        reject(err);
      } else {
        var info = {
          filename: file,
          artist: meta.artist.join(''),
          title: meta.title,
          duration: meta.duration,
          startsTime: null
        }
        resolve(info);
      }
    });
  });
  return promise;
}
