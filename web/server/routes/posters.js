var express = require('express');
var router = express.Router();
// md compiler
var marked = require('marked');
// default values
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

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
    // markdown middleware
    console.log(poster);
    var $poster = poster[0];
    var poster_content_html = marked($poster.content || '');
    poster[0].content = poster_content_html;
    res.send(poster);
  });
});

module.exports = router;
