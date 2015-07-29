var express = require('express');
var router = express.Router();

var Posters = require('../models/posters');

router.get('/posters/:id', function(req, res, next) {

    res.render('sliders', {
      posters: []
    });

});

module.exports = router;