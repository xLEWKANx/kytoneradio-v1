var express = require('express');
var router = express.Router();

var Posters = require('../models/poster');

router.get('/api/posters/', function(req, res, next) {
  return Posters.find({}, function(err, posters) {
    if (err) throw error; // USE YOUR LOGGER, BROTHER
    res.send(posters);
  });
});

router.get('/api/posters/:outerIndex/', function(req, res, next) {
  return Posters.find({outerIndex: req.params.outerIndex}, function(err, posters) {
    if (err) throw error; // USE YOUR LOGGER, BROTHER
    res.send(posters);
  });
});

router.get('/api/posters/:outerIndex/:innerIndex/', function(req, res, next) {
  return Posters.find({
    outerIndex: req.params.outerIndex,
    innerIndex: req.params.innerIndex
  }, function(err, poster) {
    if (err) throw error; // USE YOUR LOGGER, BROTHER
    res.send(poster);
  });
});

module.exports = router;