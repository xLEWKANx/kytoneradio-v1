var express = require('express');
var router = express.Router();

var Day = require('../../server/models/track').day,
    Night = require('../../server/models/track').night;

var $playlist = require('../../service/playlist');

router.get('/api/playlist/:daytime', function(req, res, next) {
  if (req.params.daytime === 'day') {
    Day.find({}, function(err, query) {
      if (err) throw err
      res.send(query);
    })
  } else if (req.params.daytime === 'night') {
    Day.find({}, function(err, query) {
      if (err) throw err
      res.send(query);
    })
  }
});

router.get('/api/playlist/:daytime/set', function(req, res, next) {
  $playlist.scanList(req.params.daytime);
  res.send('new playlist created');
});


module.exports = router;
