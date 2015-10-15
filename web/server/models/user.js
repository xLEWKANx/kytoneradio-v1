var mongoose = require('mongoose');
var crypto   = require('crypto');

var Schema = mongoose.Schema;

  // User Schema

var User = new Schema({
  username: String,
  password: String
});


module.exports = mongoose.model('User', User);