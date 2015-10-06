var express = require('express');
var router = express.Router();

var Day = require('../../server/models/track').day,
    Night = require('../../server/models/track').night;

var $playlist = require('../../service/playlist');

router.get('/api/playlist/:daytime/set', $playlist.scanList);

router.get('/api/playlist/:daytime/reload', $playlist.reloadPlaylist);

router.get('/api/playlist/:daytime/next', $playlist.nextTracks);

module.exports = router;
