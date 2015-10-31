var express = require('express');
var router = express.Router();

var io = require('socket.io')();

var Event = require('../../server/models/event');

var logger = require('../../server/logger/winston');

var $playlist = require('../../service/playlist'),
    $scheduler = require('../../service/playlist/scheduler');
    $send = require('../../service/playlist/updater').send;

var multer  = require('multer');
var upload = multer({
    dest: './service/playlist/temp'
  }
);

router.get('/api/playlist/:daytime/set', $playlist.scanList);

router.get('/api/playlist/:daytime/reload', $playlist.reloadPlaylist);

router.post('/api/playlist/:daytime/upload', upload.single('file'), $playlist.uploadPlaylist);


router.get('/api/playlist/next', function(req, res, next) {
  res.send($scheduler.schedule.stor);
});

router.get('/api/playlist/current', function(req, res, next) {
  res.send($scheduler.track.current);
});

router.post('/api/playlist/liquidsoap', function(req, res, next) {
  try {
    if (/m3u$/.test(req.body.source)) {
      $scheduler.track.current = req.body;
      $scheduler.schedule.dequeue();
      if ($scheduler.track.current.filename !== $scheduler.schedule.first.filename) {
        logger.log('error', 'schedule was not accurate, reload');
        $scheduler.loadPlaylist();
      } else {
        $scheduler.next(Date.parse(req.body.on_air));
      }
      res.end();
    } else {
      res.end();
    }
  } catch (error) {
    throw error;
  }
})

module.exports = router;

function fileFilter(req, file, cb) {
  console.log(file);
  cb(null, true);
}