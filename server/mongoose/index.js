var mongoose = require('mongoose');
var config = require('../config');
var q = require('q');

var logger = require('../logger/winston');

var def = q.defer();

mongoose.connect(config.db.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function callback() {
  logger.server('Database connection opened');
});

// return promise
//
module.exports = def.promise;