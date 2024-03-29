var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Poster = new Schema({
  pictureUrl: String,
  content: String,
  innerIndex: Number,
  outerIndex: Number,
  local: Boolean,
  outerUrl: String
});


module.exports = mongoose.model('Poster', Poster);