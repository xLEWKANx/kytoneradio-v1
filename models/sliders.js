var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Slider = new Schema({
  outerIndex: Number,
  autoplay: Boolean,
  speed: Number,
  wrapperClass: String,
  pauseOnHover: Boolean,
  rtl: Boolean,
  playerPlaceShow: Boolean
});

// BASIC CONFIGURATION - DELETE AFTER DASHBOARD EMERGING

var SliderModel = mongoose.model('Slider', Slider);

SliderModel.find({}).exec(function(err, collection) {
  if (collection.length < 3) {
    SliderModel.create({
      outerIndex: 1,
      autoplay: true,
      speed: 300,
      wrapperClass: 'cover-wrapper',
      pauseOnHover: true,
      rtl: false,
      playerPlaceShow: true
    });
    SliderModel.create({
      outerIndex: 2,
      autoplay: true,
      speed: 300,
      wrapperClass: 'cover-wrapper-big',
      pauseOnHover: true,
      rtl: false,
      playerPlaceShow: false
    });
    SliderModel.create({
      outerIndex: 3,
      autoplay: true,
      speed: 300,
      wrapperClass: 'cover-wrapper',
      pauseOnHover: true,
      rtl: false,
      playerPlaceShow: true
    });
    console.log('\nSlider config initiated');
  }
  else console.log('\Slider config exists');
});

module.exports = mongoose.model('Slider', Slider);
