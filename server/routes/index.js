var express = require('express');
var router = express.Router();
var meta = require('../../service/meta');

var postersRoute = require('./posters'),
    dashboardRoute = require('./dashboard');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'kytoneradio',
    timenow: meta.timenow()
    
  });
});

/* ng-include redirect */

router.use(postersRoute);
router.use(dashboardRoute);

module.exports = router;
