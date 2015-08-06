var express = require('express');
var router = express.Router();
var $posterService = require('../../service/posters');

var PosterModel = require('../../models/posters');
var SliderConfigModel = require('../../models/sliders.js');

router.get('/posters/:id', function(req, res, next) {
  var id = new Number(req.params.id).toString();

  if (id != "NaN")
    $posterService.render(id, function(data) {
      console.log(data);
      res.render('slider', {
        posters: data
      });
    });

  
  else
    next({
      err: "No sliders found"
    });

});

router.get('/api/posters/', function(req, res, next) {
  return PosterModel.find({}, function(err, posters) {
    if (err) throw error; // USE YOUR LOGGER, BROTHER
    res.send(posters);
  });
});

router.get('/api/posters/:outerIndex/', function(req, res, next) {
  return PosterModel.find({outerIndex: req.params.outerIndex}, function(err, posters) {
    if (err) throw error; // USE YOUR LOGGER, BROTHER
    res.send(posters);
  });
});

router.get('/api/posters/:outerIndex/:innerIndex', function(req, res, next) {
  return PosterModel.find({
    outerIndex: req.params.outerIndex,
    innerIndex: req.params.innerIndex
  }, function(err, poster) {
    if (err) throw error; // USE YOUR LOGGER, BROTHER
    res.send(poster);
  });
});

router.get('/api/sliderConfig/:outerIndex', function(req, res, next) {
  return SliderConfigModel.find({
    outerIndex: req.params.outerIndex
  }),
  function(err, slider) {
    if (err) throw error; // USE YOUR LOGGER, BROTHER
    res.send(slider);
  };
});



module.exports = router;