var mongoose = require('mongoose');
var config = require('../config');


var logger = require('../logger/winston');

mongoose.connect(config.db.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function callback() {
  logger.server('Database connection opened to', config.db.url);
});

module.exports = mongoose;