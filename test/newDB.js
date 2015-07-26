var mongoose = require('mongoose');
var PosterModel = require('../models/posters');

function saveDB(i) {
  var sample = new PosterModel({
    pictureUrl: 'http://placekitten.comg/' + (10 - i) * 100 + '/' + i * 100,
    contant: 'sample' + i,
    innerIndex: i,
    outerIndex: 0,
    local: Boolean(i%2),
    outerUrl: 'http://google.com/'
  });

  if (i) {
    sample.save(function(err) {
      if (err) throw error;
      else {
        saveDB(i - 1);
      }
    });
  }
}

module.exports = function(i) {

  PosterModel.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      saveDB(i);
    }
  });
}

