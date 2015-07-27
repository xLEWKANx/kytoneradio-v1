var express = require('express');
var router = express.Router();
var $posterService = require('../../service/posters');

var PosterModel = require('../../models/posters');

router.get('/posters/:id', function(req, res, next) {
  var id = new Number(req.params.id).toString();

  if (id != "NaN")
    $posterService.render(id, function(data) {
      console.log(data);
      res.render('sliders', {
        posters: data
      });
    });

  
  else
    next({
      err: "No sliders found"
    });

});

router.get('/api/posters/:id', function(req, res, next) {
  return PosterModel.find({ outerIndex : req.params.id }, function(err, posters) {
    if (err) throw error;
    var posterMap = {};

    posters.forEach(function(poster) {
      posterMap[poster._id] = poster;
    });

    res.send(posterMap);
  })
});

module.exports = router;