var express = require('express');
var router = express.Router();
var meta = require('../../service/meta');

var postersRoute = require('./posters'),
    dashboardRoute = require('./dashboard'),
    $posterService = require('../../service/brands');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'kytoneradio',
    timenow: meta.timenow(),
    brands: $posterService
  });
  console.log($posterService);
});

/* ng-include redirect */

router.use(postersRoute);
router.use('/dashboard',dashboardRoute);

module.exports = router;
