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
router.get('/partials/:view', function(req, res, next) {
  console.log(req.params.view);
  res.render('../source/views/' + req.params.view);
});

router.use(postersRoute);
router.use('/dashboard',dashboardRoute);

module.exports = router;
