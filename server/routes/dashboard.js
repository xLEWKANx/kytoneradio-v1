var express = require('express');
var router = express.Router();
var $postManager = require('../../service/posters');

var Posters = require('../../models/posters');

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

router.param('postid', function(req,res,next,id){
   console.log('postid',id);
   Posters.find({
      _id: id
   }, function(err, poster) {
      if (err) {
         next(err);
      } 
      else 
         if (poster) {
            req.poster = poster;
            next();
         } 
         else {
            next(new Error('failed to load poster'));
         }
   });
})

// Posters configuration

router.route('/posters')

   .get(function(req,res,next){
      Posters.find({},function(err,posters){
         if (err){
            next(err)
         }
         else
             // OK
             res.render('dashboard/posters',{
               dest: 'posters',
               posters: posters || false
             });
      });
   })

router.get('/posters/new', function(req,res,next){
   res.render('dashboard/posters-edit', {
      dest: 'new',
      poster: {
           pictureUrl: '',
           content: '',
           innerIndex: '',
           outerIndex: '',
           local: '',
           outerUrl: ''
      }
   })
})

router.route('/posters/:postid')

   .get(function(req,res,next){
      res.render('dashboard/posters-edit',{
         dest: 'edit',
         poster : req.poster[0]
      })
   });

// Posters 



// Player configuration
router.get('/player', function(req,res,next){
  res.render('dashboard/player',{
    dest: 'player'
  });
});


module.exports = router;

// PRIVATE METHODS
// 


function getPosts(req,res,next){
  $postManager.getAllPosts(function(posts){
    req.scope.posts = posts;
    next();
  });
};