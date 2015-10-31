var path = require('path'),
    fs = require('fs'),
    logger = require('../../server/logger/winston.js'),
    _ = require('lodash'),
    slash = require('slash'),
    config = require('../../server/config');

module.exports = {
  create, read, rebase, deleteCorrupted
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
      resolve(result);
    });
  });

  return promise;
}

function rebase(files, temp, daytime) {
  var promise = new Promise(function(resolve, reject) {
  var trackPath = config.paths.music[daytime];
  var filenames = files.map(e => {return path.basename(e)})
    fs.readFile(temp, function(err, data) {
      if (err) {
        logger.log('error', 'playlist reading fail', err);
        reject(err);
      }
      var result = data.toString().split('\n').map(e => {
        var filename = path.basename(slash(e));
        return filename.replace(/\s+$/, "");
      })
      result = _.remove(result, function(n) {
        return n != '';
      })
      if (_.difference(filenames, result).length < 1) {
        logger.log('data', 'playlist rebased with ', result.length, 'tracks');
        result = result.map(e => {return path.join(trackPath, e)})
        resolve(create(result, daytime));
      } else {
        logger.info('playlist and files do not match')
        logger.info(filenames, result)
        logger.info(_.difference(filenames, result));
        reject('playlist and files do not match');
      }
    });

    return promise;
  });
}

function deleteCorrupted(file, daytime) {
  var promise = new Promise(function(resolve) {resolve(null)});
  promise
  .then(function() {
    return read(daytime);
  })
  .then(function(files) {

    return _.pull(files, file);
  })
  .then(function(updated) {
    return create(updated, daytime)
  })
  .catch(function(err) {
    logger.log('error', 'deleting corrupted file from playlist error', err);
  })
}
