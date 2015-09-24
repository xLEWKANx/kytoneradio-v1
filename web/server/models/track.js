var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Track = new Schema({
  artist : Array,
  album : String,
  albumartist : Array,
  title : String,
  year : String,
  track : Object,
  disk : Object,
  genre : Array,
  duration : Number,
  order: Number,
  daytime: String
});

module.exports = mongoose.model('Track', Track);
