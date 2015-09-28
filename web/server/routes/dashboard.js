var express = require('express');
var router = express.Router();

var Posters = require('../models/poster');
var contextMng = require('../../service/context');

var loggerMng = require('../logger');
var logger = require('../logger/winston');

router.use('/',function(req,res,next){
  req.scope = {}
  next();
})

router.get('/', function(req, res, next) {
  res.redirect('dashboard/settings');
});

// Settings page
router.get('/settings', function(req,res,next){
  contextMng.read(function(err,data){
    loggerMng.getlogs(5, function(logs){

      res.render('dashboard/settings',{
        dest: 'settings',
        cfg_data: data,
        logs: logs
      });

    })


  })

});

router.post('/settings', function(req,res,next){
  
  contextMng.save(req.body.cfg, function(err){
    if (err)
      return next(err)
    else
      res.redirect('settings');

  });
})

router.param('postid', function(req,res,next,id){
   Posters.findOne({
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

router.post('/posters/save', function(req,res,next){
  var new_poster = new Posters(req.body);

  new_poster.save(function(err,poster){
    if (err){
      logger.log('error','Something wrong while creating Poster #%s', poster.id);
      return;
    }
    logger.log('data','Poster #%s created', poster.id)
    // save complite
    res.redirect('/dashboard/posters');
  })

})

router.route('/posters/:postid')

   .get(function(req,res,next){
      res.render('dashboard/posters-edit',{
         dest: 'edit',
         poster : req.poster
      })
   });

// Posters

router.post('/posters/:postid/save', function(req,res,next){
  var poster = req.poster;

  for (var i in req.body){
    var prop = req.body[i];

    poster[i] = prop;
  }

  poster.save(function(err){
    if (err){
      logger.log('error','Something wrong while saving Poster #%s', poster.id);
      return;
    }
    logger.log('data','Poster #%s updated', poster.id)
    // save complite
    res.redirect('/dashboard/posters');
  })
  
})

router.post('/posters/:postid/remove', function(req,res,next){
  var poster = req.poster;

  poster.remove(function(err){
    if (err)
      return next(err)

    logger.log('data', 'Poster #%s removed', poster.id)
    // remove compite
    res.redirect('/dashboard/posters');
  })
})

// Player configuration
router.get('/player', function(req,res,next){
  res.render('dashboard/player',{
    dest: 'player'
  });
});


module.exports = router;