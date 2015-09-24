var fs = require('fs'),
    path = require('path'),
    mm = require('musicmetadata'),
    config = require('../../server/config'),
    logger = require('../../server/logger/winston'),
    
    Track = require('../../server/models/track.js'),
    dfd = require('q').defer();

module.exports = {
  scanDir: scanDir,
  getMetadata: getMetadata,
  saveTrackToDB: saveTrackToDB,
  getPlaylist: getPlaylist
};

function scanDir(dir) {
  dir = dir || config.music.path;

  var promise = new Promise(function(resolve, reject) {
    fs.readdir(dir, function(err, files) {
      if (err)  {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
  return promise;
}

function getMetadata(file) {

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
}

function saveTrackToDB(meta) {
  Track.create(meta, function(err, meta) {
    if (err) logger.log('error', 'cannot save to DB', err);
    logger.log('info', meta.title, ' saved to db');
  });
}

function getPlaylist(dir) {

  scanDir(dir).then(function(files) {
    files.forEach(function(file) {
      getMetadata(file).then(saveTrackToDB, function(err) {
        console.log(err);
      });
    });
  })
  .catch(function(err) {
    logger.log('error', err);
  });
  
}

