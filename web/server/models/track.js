var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Track = new Schema({
  filename : String,
  title : String,
  artist : Array,
  duration : Number
});


module.exports.day = mongoose.model('day', Track);
module.exports.night = mongoose.model('day', Track);

