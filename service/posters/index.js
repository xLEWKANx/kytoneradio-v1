var PosterModel = require('../../models/posters');

function getPosterPromise(id) {
  var query = PosterModel.find({outerIndex: id}).sort({innerIndex: 1});
  return query;
}

module.exports.pull = function(id){
  var collection = [];
  var query = getPosterPromise(id);
  query.exec(function(err, posters) {
    if (err) console.error(err);
    posters.forEach(function(poster){
      collection.push(poster.pictureUrl);
    });
    console.log('collection', collection);
    return collection;
  });
}