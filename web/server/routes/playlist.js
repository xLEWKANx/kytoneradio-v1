var express = require('express');
var router = express.Router();

var io = require('socket.io')();

var Event = require('../../server/models/event');

var logger = require('../../server/logger/winston');

var $playlist = require('../../service/playlist'),
    $scheduler = require('../../service/playlist/scheduler');
    $send = require('../../service/playlist/updater').send;

router.get('/api/playlist/:daytime/set', $playlist.scanList);

router.get('/api/playlist/:daytime/reload', $playlist.reloadPlaylist);

router.get('/api/playlist/next', function(req, res, next) {
  res.send($scheduler.schedule.stor);
});

router.get('/api/playlist/current', function(req, res, next) {
  res.send($scheduler.track.current);
});


router.post('/api/playlist/liquidsoap', function(req, res, next) {
  if (/m3u$/.test(req.body.source)) {
    $scheduler.track.current = req.body;
    $scheduler.next(req.body);
    io.emit('zdarova', $scheduler.schedule.stor);
  } else {
    res.end();
  }
})

module.exports = router;
