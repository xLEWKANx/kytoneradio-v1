var fs = require('fs'),
    path = require('path'),
    mm = require('musicmetadata'),
    config = require('../../server/config'),
    logger = require('../../server/logger/winston'),

    Day = require('../../server/models/track').day,
    Night = require('../../server/models/track').night


module.exports = {
  scanList: scanList
}

function scanList(daytime) {
  return scanDir(daytime)
    .then(function(files) {
      return createM3U(files, daytime)
    })
    .then(function(files) {
      return Promise.all(files.map(getMetadata))
    })
    .then(function(meta) {
      saveToDB(meta, daytime)
    })
    .catch(function(err) {
      logger.log('error', err);
    });
}

// Private methods

function createM3U(collection, daytime) {
  try {
    var playlistPath = config.paths.playlist[daytime];
    var files = collection.map((track) => { return track.filename });
    fs.writeFileSync(playlistPath, files.join('\n'));
    logger.log('info', 'playlist created with ', files.length, ' tracks');
    return collection;
  } catch (err) {
    logger.log('error', 'playlist didn\'t create', err);
  }
};


function scanDir(daytime) {
  var dir = config.paths.music[daytime];

  if (dir == undefined) throw new Error('dir is undefined');

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
          artist: meta.artist.join(''),
          title: meta.title,
          duration: meta.duration
        }
        resolve(info);
      }
    });
  });
  return promise;
}

function saveToDB(meta, daytime) {
  if (daytime === 'day') {
    meta.forEach(function(track) {
      Day.remove({}, function(err, query) {
        if (err) throw err; });
      Day.create(track, function(err, track) {
        if (err) logger.log('error', 'fail to save track to Day', err);
        logger.log('info', track, ' saved into Day!');
      })
    })
  } else if (daytime === 'night') {
    meta.forEach(function(track) {
      Night.remove({}, function(err, query) {
        if (err) throw err; });
      Night.create(track, function(err, track) {
        if (err) logger.log('error', 'fail to save track to Night', err);
        logger.log('info', track, ' saved into Night!');
      })
    })
  } else {
    throw new Error('daytime is not defined!');
  }
}