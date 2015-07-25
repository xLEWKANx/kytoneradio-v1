var express = require('express');
var router = express.Router();
var $posterService = require('../../service/posters');

router.get('/posters/:id', function(req, res, next) {
  var id = new Number(req.params.id).toString();

  if (id != "NaN")
    res.render('sliders',{
      posters: $posterService.pull(id)
    });
  
  else
    next({
      err: "No sliders found"
    });

});

module.exports = router;