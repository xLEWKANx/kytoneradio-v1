var express = require('express');
var router = express.Router();
var meta = require('../../service/meta');

var postersRoute = require('./posters'),
    dashboardRoute = require('./dashboard'),
    $brandManager = require('../../service/brands');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'kytoneradio',
    timenow: meta.timenow(),
    brands: $brandManager.getSrc()
  });

});



// posters list responce
router.use(postersRoute);

// control panel
router.use('/dashboard',dashboardRoute);

module.exports = router;
