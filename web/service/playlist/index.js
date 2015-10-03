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

function scanList(req, res, next) {
  var daytime = req.params.daytime;
  scanDir(daytime)
    .then(function(files) {
      return createM3U(files, daytime)
    })
    .then(function(files) {
      return Promise.all(files.map(getMetadata))
    })
    .then(function(meta) {
      return saveToDB(meta, daytime)
    })
    .then(function(meta) {
      res.send('playlist created, tracks stored')
    })
    .catch(function(err) {

      logger.log('error', 'promise', err);
      res.send(err);
    });

}

// Private methods

function createM3U(files, daytime) {
  var promise = new Promise(function(resolve, reject) {
    var playlistPath = config.paths.playlist[daytime];

    fs.writeFile(playlistPath, files.join('\n'), 'utf8', function(err) {
      if (err) {
        logger.log('error', 'playlist creation fail', err);
        reject(err);
      }
      logger.log('info', 'playlist created with ', files.length, ' tracks', ' to',
      playlistPath);
    });
    resolve(files);
  })
  return promise;
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
  var promise = new Promise(function (resolve, reject) {
    if (daytime === 'day') {
      meta.forEach(function(track) {
        Day.remove({}, function(err, query) {
          if (err) {
            reject(err);
          }
        });
        Day.create(track, function(err, track) {
          if (err) {
            logger.log('error', 'fail to save track to Day', err);
            reject(err)
          }
        })
      })
    } else if (daytime === 'night') {
      meta.forEach(function(track) {
        Night.remove({}, function(err, query) {
          if (err) {
            reject(err);
          }
        });
        Night.create(track, function(err, track) {
          if (err) {
            logger.log('error', 'fail to save track to Night', err);
            reject(err)
          }
        })
      })
    } else {
      throw new Error('daytime is not defined!');
    }
    resolve();
  });
  return promise;
}