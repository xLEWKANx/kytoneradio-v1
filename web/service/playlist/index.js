var fs = require('fs'),
    path = require('path'),
    mm = require('musicmetadata'),
    config = require('../../server/config'),
    logger = require('../../server/logger/winston'),

    Track = require('../../server/models/track');

var telnet = require('./telnet'),
    m3u = require('./m3u'),
    meta = require('../meta/'),
    schedule = require('./scheduler.js');

module.exports = {
  scanList,
  renderList,
  reloadPlaylist
}

function scanList(req, res, next) {
  var daytime = req.params.daytime;

  scanDir(daytime)
    .then(function(files) {
      return m3u.create(files, daytime);
    })
    .then(function(meta) {
      res.send('new playlist with ' + meta.length + ' tracks, please reload');
    })
    .catch(function(err) {
      logger.log('error', 'playlist creation', err);
      res.send('playlist creation problem (check meta or delete \
        non-mp3 files)');
    });
}

function renderList(req, res, next) {
  var daytime = req.params.daytime;
  
  m3u.read(daytime)
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
  var daytime = req.params.daytime;

  telnet.reload(daytime)
    .then(function() {
      if (daytime === meta.getDaytime()) {
        schedule.init(daytime);
        
      }
      res.send(daytime + ' reloaded!');
    })
    .catch(function(err) {
      logger('error', 'relooad error', error);
      res.send('playlist didn\'t reload');
    });
}

// Private methods

function scanDir(daytime) {
  var dir = config.paths.music[daytime];

  if (dir == undefined) throw new Error('dir is undefined');

  var promise = new Promise(function(resolve, reject) {
    fs.readdir(dir, function(err, files) {
      if (err)  {
        logger.log('error', 'readdir error', err);
        reject(err);
      } else {
        resolve(files.map(file => path.join(dir, file)));
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

