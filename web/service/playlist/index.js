var fs = require('fs'),
    path = require('path'),
    mm = require('musicmetadata'),
    config = require('../../server/config'),
    logger = require('../../server/logger/winston'),
    
    Track = require('../../server/models/track.js');

// Private functions
function getDir(daytime) {
  switch(daytime) {
    case 'day':
      return config.paths.music.day;
    case 'night':
      return config.paths.music.night;
    case 'stable':
    default:
      return config.paths.music.stable;
  }
}

function scanDir(dir) {

  var promise = new Promise(function(resolve, reject) {
    fs.readdir(dir, function(err, files) {
      if (err)  {
        reject(err);
      } else {
        resolve(files.map(file => path.join(dir, file)));
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
      } else {
        var info = {
          filename: file,
          artist: meta.artist.join(),
          title: meta.title,
          duration: meta.duration
        }
        resolve(info);
      }
    });
  });
  return promise;
}


function scanList(req, res, next) {
  var dir = getDir(req.params.daytime);

  scanDir(dir)
    .then(function(files) {
      return Promise.all(files.map(getMetadata))
    })
    .then(function(infoArr) {
      res.send(infoArr);
    })
    .catch(function(err) {
      logger.log('error', err);
    });
}

module.exports.scanList = scanList;
