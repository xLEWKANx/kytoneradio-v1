var q = require('q'),
    fs = require('fs'),
    mm = require('musicmetadata'),
    path = require('path'),
    logger = require('../server/logger/winston'),
    Track = require('../server/models/track.js'),
    mongoose = require('../server/mongoose'),
    m3u = require('../service/playlist/createM3U.js'),
    config = require('../server/config');


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

function filterMP3(files) {
  return files.filter(string => string.match(/^([a-zA-Z0-9_-]+)(\.mp3)$/));
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


  scanDir().then(filterMP3).then(m3u.createPlaylist, function(err) {
    console.log(err);
  }).then(function(files) {
    files.forEach(function(file) {
      getMetadata(file).then(saveTrackToDB, function(err) {
        console.log(err);
      });
    });
  })
  .catch(function(err) {
    logger.log('error', err);
  });
  

