var express = require('express');
var router = express.Router();
var $postManager = require('../../service/posters');

router.use('/',function(req,res,next){
  req.scope = {}
  next();
})

router.get('/', function(req, res, next) {
  // res.render('dashboard/index');
  res.redirect('dashboard/settings');
});

router.get('/settings', function(req,res,next){
  res.render('dashboard/settings',{
    dest: 'settings'
  });
});

function readPosts(req,res,next){
  $postManager.getAllPosts(function(posts){
    req.scope.posts = posts;
    next();
  });
};

router.get('/posters',readPosts, function(req,res,next){

    res.render('dashboard/posters',{
      dest: 'posters',
      posts: req.scope.posts || false
    });


});

router.get('/player', function(req,res,next){
  res.render('dashboard/player',{
    dest: 'player'
  });
});

module.exports = router;