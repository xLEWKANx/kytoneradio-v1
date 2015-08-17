var mongoose = require('mongoose');
var config = require('../config');
var q = require('q');

var def = q.defer();

mongoose.connect(config.db.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function callback() {
  console.log('Database opened');
});

// return promise
//
module.exports = def.promise;