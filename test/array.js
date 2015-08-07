var mongoose = require('mongoose');
var PosterModel = require('../models/posters');


function getPosterPromise(id) {
  var promise = PosterModel.find({outerIndex: id}).sort({innerIndex: 1}).exec();
  return promise;
}
function getPosterArray(cb, id) {
  var collection = [];
  var promise = getPosterPromise(id);
  promise.then(function(posters) {
    posters.forEach(function(poster) {
      return collection.push(poster.pictureUrl);
    });
    cb(collection); // callback
  }, function(error) {
    console.error(error);
  });
}

function renderPosters(array) {
  res.render('sliders', {
    posters: array
  })
}
module.exports.render = function(id) {
  console.log(getPosterArray(renderPosters, id));
  return getPosterArray(renderPosters, id);
}
