var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Slider = new Schema({
  outerIndex: Number,
  autoplay: Boolean,
  speed: Number,
  isBig: Boolean,
  pauseOnHover: Boolean,
  rtl: Boolean,
  blockAfter: Object
});

// BASIC CONFIGURATION - DELETE AFTER DASHBOARD EMERGING

var SliderModel = mongoose.model('Slider', Slider);

SliderModel.find({}).exec(function(err, collection) {
  if (collection.length < 3) {
    SliderModel.create({
      outerIndex: 1,
      autoplay: true,
      speed: 300,
      isBig: false,
      pauseOnHover: true,
      rtl: false,
      blockAfter: {}
    });
    SliderModel.create({
      outerIndex: 2,
      autoplay: true,
      speed: 300,
      isBig: true,
      pauseOnHover: true,
      rtl: false,
      blockAfter: {}
    });
    SliderModel.create({
      outerIndex: 3,
      autoplay: true,
      speed: 300,
      isBig: false,
      pauseOnHover: true,
      rtl: false,
      blockAfter: {}
    });
    console.log('\nSlider config initiated');
  }
  else console.log('\Slider config exists');
});

module.exports = mongoose.model('Slider', Slider);