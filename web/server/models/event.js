var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Event = new Schema({
  artist: String,
  title: String,
  duration: Number,
  startsTime: Number,
  isEvent: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model('Event', Event);