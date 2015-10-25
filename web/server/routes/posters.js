var express = require('express');
var router = express.Router();
// md compiler
var marked = require('marked');
// default values
var renderer = new marked.Renderer();

renderer.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a target="_blank" href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

var Posters = require('../models/poster');

router.get('/api/posters/', function(req, res, next) {
  return Posters.find({}, function(err, posters) {
    if (err) next(err);
    res.send(posters);
  });
});

router.get('/api/posters/:outerIndex/', function(req, res, next) {
  return Posters.find({outerIndex: req.params.outerIndex}, function(err, posters) {
    if (err) next(err);
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
    var $poster = poster[0];
    var poster_content_html = marked($poster.content || '');
    poster[0].content = poster_content_html;
    res.send(poster);
  });
});

module.exports = router;
