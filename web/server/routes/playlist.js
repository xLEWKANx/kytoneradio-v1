var express = require('express');
var router = express.Router();

var $playlist = require('../../service/playlist');

router.get('/api/player/:daytime', $playlist.scanList);

module.exports = router;
