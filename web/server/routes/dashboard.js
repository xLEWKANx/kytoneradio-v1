var express = require('express');
var router = express.Router();

var Posters = require('../models/poster');
var Event = require('../../server/models/event');


var contextMng = require('../../service/context');

var loggerMng = require('../logger');
var logger = require('../logger/winston');

var $playlist = require('../../service/playlist');
var meta = require('../../service/meta/');

router.use('/',function(req,res,next){
  req.scope = {}
  next();
})

router.get('/', function(req, res, next) {
  res.redirect('/dashboard/settings');
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
    else if (poster) {
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
    Posters.find({})
      .sort({outerIndex: 1, innerIndex: 1})
      .exec(function(err,posters){
        if (err){
          next(err)
        }
        else
          res.render('dashboard/posters',
          {
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
    console.log(new_poster);
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
  console.log(poster.local)
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
function formatDuration(track) {
  var minutes = Math.floor(track.duration/60);
  var seconds = track.duration - minutes * 60;
  track.time = minutes + ':' + seconds.toFixed();
  return track;
}


router.get('/playlist/:daytime', $playlist.renderList);


// Events configuartion

router.param('eventid', function(req, res, next, id) {
  Event.find({
    _id: id
  }, function(err, event) {
    if (err) {
      next(err);
    } else if (event) {
      req.event = event;
      next();
    } else {
      next(new Error('failed to load event'));
    }
  });
})

router.get('/events', function(req, res, next) {
  Event.find({}, function(err, events) {
    if (err){
      next(err);
    }
    events.forEach(function(event) {
      var date = new meta.fDate(event.startsTime);
      event.date = date.year + '-' + date.month + '-' + date.day;
      event.time = date.hours + ':' + date.minutes;
      var dur = new meta.fDuration(event.duration);
      event.dur = dur.hours + ':' + dur.minutes;
    });
    res.render(
      'dashboard/events',
      {
        dest: 'Events',
        events: events
      }
    )
  })

})

router.get('/events/new', function(req, res, next) {
  res.render(
    'dashboard/events-edit',
    {
      dest: 'new Event',
      event: {}
    }
  )
});

router.post('/events/save', function(req, res, next) {
  var new_event = new Event({
    artist: req.body.artist,
    title: req.body.title,
    startsTime: Date.parse(req.body.date + 'T' + req.body.time + '+03:00'),
    duration: req.body.hours*60*60 + req.body.minutes*60
  });
  new_event.save(function(err, event){
    if (err){
      logger.log('error','Something wrong while creating Poster #%s', event.id);
      return;
    }
    logger.log('data','Poster #%s created', event.id)
    res.redirect('/dashboard/events');
  })
})

router.get('/events/:eventid', function(req, res, next) {
  event = req.event[0];
  var date = new meta.fDate(event.startsTime);
  event.date = date.year + '-' + date.month + '-' + date.day;
  event.time = date.hours + ':' + date.minutes;
  var dur = new meta.fDuration(event.duration);
  event.hours = dur.hours;
  event.minutes = dur.minutes;
  res.render(
    'dashboard/events-edit',
    {
      dest: 'edit',
      event : event
    }
  )
})

router.post('/events/:eventid/save', function(req, res, next) {
  var event = req.event[0];

  event.startsTime = Date.parse(req.body.date + 'T' + req.body.time + '+03:00'),
  event.duration = req.body.hours*60*60 + req.body.minutes*60

  event.save(function(err){
    if (err){
      logger.log('error','Something wrong while saving event #%s', event.id);
      return;
    }
    logger.log('data','Event #%s updated', event.id)
    // save complite
    res.redirect('/dashboard/events');
  })
})

router.post('/events/:eventid/remove', function(req,res,next){
  var event = req.event[0];

  event.remove(function(err){
    if (err)
      return next(err)

    logger.log('data', 'Event #%s removed', event.id)
    // remove compite
    res.redirect('/dashboard/events');
  })
})

module.exports = router;