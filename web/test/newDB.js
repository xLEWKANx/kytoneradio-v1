var mongoose = require('mongoose'),
    config = require('../server/config'),
    PosterModel = require('../models/posters'),
    db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function callback() {
  console.log('database opened\nStarting init...\n');
  init();
});

mongoose.connect(config.db.url);

// PRIVATE FUNCTIONS
// 

function init(){
  saveDB(6);
}

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
  } else {
    console.log('\nDone.\n')
  }
}

// module.exports = function(i) {

//   PosterModel.find({}).exec(function(err, collection) {
//     if(collection.length === 0) {
//       saveDB(i);
//     }
//   });
// }

