var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var logger = require('../../server/logger/winston');

var User = require('../../server/models/user');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.password === password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  logger.log('info', 'users ', user, ' connected!');
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


module.exports = passport;

