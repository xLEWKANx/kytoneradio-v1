var path = require('path'),
    fs = require('fs'),
    logger = require('../../server/logger/winston.js'),
    config = require('../../server/config');

module.exports = {
  create, read
}

function create(files, daytime) {
  var promise = new Promise(function(resolve, reject) {
    var playlistPath = config.paths.playlist[daytime];

    fs.writeFile(playlistPath, files.join('\n'), 'utf8', function(err) {
      if (err) {
        logger.log('error', 'playlist creation fail', err);
        reject(err);
      }
      logger.log('data', 'playlist created with ', files.length, ' tracks', ' to',
      playlistPath);
      resolve(files);
    });
  })
  return promise;
};

function read(daytime) {
  var promise = new Promise(function(resolve, reject) {
    var playlistPath = config.paths.playlist[daytime];

    fs.readFile(playlistPath, function(err, data) {
      if (err) {
        logger.log('error', 'playlist reading fail', err);
        reject(err);
      }
      var result = data.toString().split('\n');
      logger.log('data', 'playlist read with ', result.length, 'tracks');
      resolve(result);
    });
  });

  return promise;
}
