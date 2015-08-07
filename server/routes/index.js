var express = require('express');
var router = express.Router();
var meta = require('../../service/meta');

var postersRoute = require('./posters'),
    dashboardRoute = require('./dashboard'),
    $brandManager = require('../../service/brands'),
    contextRoute = require('./context');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'kytoneradio',
    timenow: meta.timenow(),
    brands: $brandManager.getSrc()
  });

});

<<<<<<< HEAD
//context js
router.use(contextRoute);
=======
/* ng-include redirect */
router.get('/partials/:view', function(req, res, next) {
  console.log(req.params.view);
  res.render('../source/views/' + req.params.view);
});
>>>>>>> angular

// posters list responce
router.use(postersRoute);

// control panel
router.use('/dashboard',dashboardRoute);

module.exports = router;
