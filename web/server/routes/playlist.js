var express = require('express');
var router = express.Router();

var logger = require('../../server/logger/winston');

var $playlist = require('../../service/playlist'),
    $scheduler = require('../../service/playlist/scheduler');

router.get('/api/playlist/:daytime/set', $playlist.scanList);

router.get('/api/playlist/:daytime/reload', $playlist.reloadPlaylist);

router.get('/api/playlist/next', function(req, res, next) {
  res.send($scheduler.getSchedule());
});

router.get('/api/playlist/events', function(req, res, next) {

});

router.post('/api/playlist/liquidsoap', function(req, res, next) {
  if (req.body.source == 'night(dot)m3u' || req.body.source == 'day(dot)m3u') {
    $scheduler.next(req.body);
  } else {
    console.log('end');
    res.end();
  }

})

module.exports = router;
