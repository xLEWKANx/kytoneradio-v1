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

// BASIC CONFIGURATION - DELETE AFTER DASHBOARD EMERGING

var PosterModel = mongoose.model('Poster', Poster);

function saveDB(i, j) {
  var sample = new PosterModel({
    pictureUrl: 'http://placehold.it/' + (500 + (i * 10)) + 'x' + (600 - (i * 10)),
    content: 'sample' + i,
    innerIndex: i,
    outerIndex: j,
    local: Boolean(i%2),
    outerUrl: 'http://google.com/'
  });
  if (i) {
    sample.save(function(err) {
      if (err) throw error;
      else {
        saveDB(i - 1, j);
      }
    });
  } else {
    console.log('\nDone.\n')
  }
}

PosterModel.find({}).exec(function(err, collection) {
  if (collection.length < 18) {
    saveDB(6, 1);
    saveDB(6, 2);
    saveDB(6, 3);
    console.log('\Posters config initiated');
  }
  else console.log('\Posters config exists');
});


module.exports = mongoose.model('Poster', Poster);