var fs = require('fs'),
    path = require('path'),
    mm = require('musicmetadata'),
    config = require('../../server/config'),
    logger = require('../../server/logger/winston'),
    
    Track = require('../../server/models/track.js');

// Private functions

function scanDir(dir) {
  dir = dir || config.paths.music;

  var promise = new Promise(function(resolve, reject) {
    fs.readdir(dir, function(err, files) {
      if (err)  {
        reject(err);
      } else {
        files.forEach(function(file) {
          resolve(file);
        });
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


function getPlaylist(dir) {

  scanDir(dir).then(function(files) {
    files.forEach(function(file) {
      getMetadata(file).then(function(arg) {console.log(arg)})
    });
  })
  .catch(function(err) {
    logger.log('error', err);
  });
  
}

