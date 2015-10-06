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
    })
    .catch(function(err) {
      console.log(err);
    })
}

function next(current) {
  var scheduleEnd = schedule.last.startsTime + schedule.last.duration*1000;
  console.log(time.getDaytime(scheduleEnd));

  telnet.nextTracks(time.getDaytime(scheduleEnd))
    .then(function(result){
      console.log(result, current);
    })
    .then(function() {
      schedule.setTime(Date.parse(current.on_air));
    })
    .catch(function(err) {
      console.log(err);
    })

}

function getSchedule() {
  return schedule.stor;
}

// Private methods

function getMetadata(file, index) {
  var daytime = path.basename(path.resolve(file, '../..'));
  var stream = fs.createReadStream(file);

  var promise = new Promise(function(resolve, reject) {
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

