var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var morgan = require('./logger/morgan');
var routes = require('./routes');
var config = require('./config');
var mongoose = require('./mongoose');

var schedule = require('../service/playlist/scheduler');
var meta = require('../service/meta');
var passport = require('../service/meta/passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

var sessionOpts = {
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: 'asdadasdasdsadsadasdasd123asde123s12ij12jias8*ASasi1123asdja1ji3',
  cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
}

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


// initialize schedule
schedule.loadPlaylist();

// morgan logger
app.use(morgan);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(config.paths.public));

app.use('/', routes);


// view engine setup
app.set('views', config.paths.views );
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
