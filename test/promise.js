var q = require('q'),
    fs = require('fs'),
    mm = require('musicmetadata'),
    path = require('path'),
    logger = require('../server/logger/winston'),
    Track = require('../server/models/track.js'),
    mongoose = require('../server/mongoose'),
    config = require('../server/config');


function scanDir() {
  var promise = new Promise(function(resolve, reject) {
    fs.readdir(config.music.path, function(err, files) {
      if (err)  {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
  return promise;
}

var setMetadata = function(file) {

  file = path.join(config.music.path, file);
  var promise = new Promise(function(resolve, reject) {
    mm(fs.createReadStream(file), {duration: true}, function (err, meta) {
      if (err) {
        logger.log('error', 'cannot read ', file);
        reject(err);
      } else
      resolve(meta);
    });
  });
  return promise;
};


var saveTrackToDB = function(meta) {
  Track.create(meta, function(err, meta) {
    if (err) logger.log('error', 'cannot save to DB', err);
    logger.log('info', meta.title, ' saved to db');
  });
};


var promise = scanDir();

promise.then(function(files) {
  files.forEach(function(file) {
    setMetadata(file).then(saveTrackToDB, function(err) {
      console.log(err);
    });
  });
})
.catch(function(err) {
  logger.log('error', err);
})
