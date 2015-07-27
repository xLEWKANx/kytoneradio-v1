var mongoose = require('mongoose');
var PosterModel = require('../../models/posters');


function getPosterPromise(id) {
  var promise = PosterModel.find({outerIndex: id}).sort({innerIndex: 1}).exec();
  return promise;
}
function getPosterArray(id, cb) {
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

module.exports.render = getPosterArray;
