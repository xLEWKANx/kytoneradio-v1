var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.render('dashboard/index');
  res.redirect('dashboard/settings');
});

router.get('/settings', function(req,res,next){
  res.render('dashboard/settings',{
    dest: 'settings'
  });
});

router.get('/posters', function(req,res,next){
  res.render('dashboard/posters',{
    dest: 'posters'
  });
});

router.get('/player', function(req,res,next){
  res.render('dashboard/player',{
    dest: 'player'
  });
});

module.exports = router;