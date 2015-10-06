var fs = require('fs'),
    path = require('path'),
    mm = require('musicmetadata'),
    config = require('../../server/config'),
    logger = require('../../server/logger/winston'),

    Track = require('../../server/models/track');

var telnet = require('./telnet');

module.exports = {
  scanList,
  renderList,
  reloadPlaylist,
  nextTracks
}

function scanList(req, res, next) {
  var daytime = req.params.daytime;

  scanDir(daytime)
    .then(function(files) {
      return createM3U(files, daytime);
    })
    .then(function(meta) {
      res.send(JSON.stringify(meta));
    })
    .catch(function(err) {
      logger.log('error', 'playlist creation', err);
      res.send(new Error('playlist creation problem (check meta or delete \
        non-mp3 files)'));
    });
}

function renderList(req, res, next) {
  var daytime = req.params.daytime;
  
  readM3U(daytime)
    .then(function(arr) {
      res.render(
        'dashboard/player',
        {
          dest: 'Kytone ' + daytime.charAt(0).toUpperCase() + daytime.slice(1),
          context: daytime,
          tracks: arr
        })
    })
    .catch(function(err) {
      logger.log('error', 'playlist reading', err);
      res.send(new Error('playlist reading problem'));
    });

}


function reloadPlaylist(req, res, next) {
  var playlist = telnetDaytime(req.params.daytime);

  telnet.reload(playlist)
    .then(function() {
      res.send(playlist + ' reloaded!');
    })
    .catch(function(err) {
      res.send(err);
    });
}

function nextTracks(req, res, next) {
  var playlist = telnetDaytime(req.params.daytime);

  telnet.nextTracks(playlist)
    .then(function(arr) {
      logger.info('data', arr.length - 2, ' tracks delivered to', playlist);
      res.send(arr);
    })
    .catch(function(err) {
      res.send(err);
    });
}

// Private methods

// telnet playlist notation
function telnetDaytime(daytime) {
  if (daytime === 'day') {
    return 'day(dot)m3u';
  } else if (daytime === 'night') {
    return 'night(dot)m3u';
  } else {
    logger.log('error', 'daytime is not defined');
    throw new Error('daytime not defined');
  }
}

function createM3U(files, daytime) {
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

function readM3U(daytime) {
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

function getMetadata(file, index) {
  var daytime = path.basename(path.resolve(file, '../..'));
  var stream = fs.createReadStream(file);

  var promise = new Promise(function(resolve, reject) {
    mm(stream, function (err, meta) {
      if (err) {
        logger.log('error', 'cannot read ', file);
        reject(err);
      } else {
        var info = {
          filename: file,
          artist: meta.artist.join(''),
          title: meta.title,
          duration: meta.duration,
          daytime: daytime,
          index: index
        }
        resolve(info);
      }
    });
  });
  return promise;
}

function savetoDB(meta) {
  var track = new Track(meta);
  var promise = track.save(meta, function(err) {
    if (err) logger.log('error', 'save meta err: ', err);
  });

  return promise;
}

