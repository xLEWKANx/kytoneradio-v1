var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Track = new Schema({
  filename : String,
  title : String,
  artist : Array,
  duration : Number,
  daytime : String,
  index : Number
});


module.exports = mongoose.model('Track', Track);

