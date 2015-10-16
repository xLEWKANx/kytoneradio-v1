var express = require('express');
var router = express.Router();
var meta = require('../../service/meta');

var User = require('../../server/models/user');
var passport = require('passport');

var postersRoute = require('./posters'),
    playlistRoute = require('./playlist'),
    dashboardRoute = require('./dashboard'),
    $brandManager = require('../../service/brands');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'kytoneradio',
    timenow: meta.viewTime(),
    brands: $brandManager.getSrc()
  });
});

router.get('/offline', function(req, res, next) {
  res.render('offline');
})


// posters list responce
router.use(postersRoute);

router.use(playlistRoute);

router.route('/login')
  .get(function(req, res, next) {
    res.render('dashboard/login');
  })
  .post(function(req, res, next) {
      var auth = passport.authenticate('local', function(err, user) {
        if (err)
          return next(err);
        if (!user){
          res.send({success: false})
          return;
        }
        req.logIn(user, function(err) {
          if (err)
            return next (err);
          res.redirect('/dashboard/settings');
        });
      });
      auth(req, res, next);
  })


function isAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
       res.status("401").redirect('/login');
    }
}

// control panel
router.use('/dashboard', isAuth, dashboardRoute);

module.exports = router;
