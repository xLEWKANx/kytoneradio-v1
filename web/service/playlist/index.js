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
  uploadPlaylist,
  reloadPlaylist
}

function scanList(req, res, next) {
  var daytime = req.params.daytime;

  scanDir(daytime)
    .then(function(files) {
      return m3u.create(files, daytime);
    })
    .then(function(meta) {
      req.flash('info', 'new playlist with ' + meta.length + ' tracks, please reload')
      res.redirect('/dashboard/playlist/' + daytime);
    })
    .catch(function(err) {
      logger.log('error', 'playlist creation', err);
      req.flash('info', 'playlist creation problem (check meta or delete \
        non-mp3 files)')
      res.redirect('/dashboard/playlist/' + daytime);
    })
}

function renderList(req, res, next) {
  var daytime = req.params.daytime;
  var involved = schedule.storage;

  m3u.read(daytime, involved)
    .then(function(arr) {
      res.render(
        'dashboard/player',
        {
          dest: 'Kytone ' + daytime.charAt(0).toUpperCase() + daytime.slice(1),
          context: daytime,
          tracks: arr,
          ready: involved.ready,
          playing: involved.playing,
          message: req.flash('info')
        })
    })
    .catch(function(err) {
      logger.log('error', 'playlist reading', err);
      req.flash('info', 'playlist reading problem');
      res.redirect('/dashboard/playlist/' + daytime);
    });

}

function uploadPlaylist(req, res, next) {
  var daytime = req.params.daytime;
  var temp = path.join(req.file.destination, req.file.filename);

  scanDir(daytime, temp)
    .then(function(files) {
      return m3u.rebase(files, temp, daytime);
    })
    .then(function() {
      fs.unlinkSync(temp);
    })
    .catch(function(err) {
      logger.log('error', 'playlist uploading', err);
      req.flash('info', 'playlist uploading problem');
      res.redirect('/dashboard/playlist/' + daytime);
    });

  res.redirect('/dashboard/playlist/' + daytime)
}


function reloadPlaylist(req, res, next) {
  var daytime = req.params.daytime;

  telnet.reload(daytime)
    .then(function() {
      schedule.loadPlaylist();
      req.flash('info', daytime + ' reloaded!');
      res.redirect('/dashboard/playlist/' + daytime);
    })
    .catch(function(err) {
      logger.info('error', 'relooad error', error);
      req.flash('info', 'playlist didn\'t reload');
      res.redirect('/dashboard/playlist/' + daytime);
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


