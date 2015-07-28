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

// Settings page
router.get('/settings', function(req,res,next){
  res.render('dashboard/settings',{
    dest: 'settings'
  });
});

// Posters configuration
router.get('/posters',readPosts, function(req,res,next){

    res.render('dashboard/posters',{
      dest: 'posters',
      posts: req.scope.posts || false
    });

});

// Posters 
router.get('/posters/new', function(req,res,next){
  // res.redirect
  
});

router.get('/posters/:id', function(req,res,next){

});


// Player configuration
router.get('/player', function(req,res,next){
  res.render('dashboard/player',{
    dest: 'player'
  });
});


module.exports = router;

// PRIVATE METHODS
// 

function readPosts(req,res,next){
  $postManager.getAllPosts(function(posts){
    req.scope.posts = posts;
    next();
  });
};