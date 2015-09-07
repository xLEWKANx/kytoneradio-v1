var fs = require('fs'),
    path = require('path'),
    mm = require('musicmetadata'),
    config = require('../../server/config'),
    logger = require('../../server/logger/winston'),
    
    Track = require('../../server/models/track.js');

module.exports = {
  scanDir: scanDir,
  clearDB: clearDB
};

function scanDir() {
  fs.readdir(config.music.path, function(err, files) {
    if (err) throw err;

    files.forEach(function(file) {
      var file = path.join(config.music.path, file);
      mm(fs.createReadStream(file), {duration: true},function (err, metadata) {
        if (err) {
          console.log('cannot read ', file);
          return;
        }
        Track.create(metadata, function(err, track) {
          if (err) throw err;
          console.log(track, ' saved!');
        });
      });
    });
  });
}

function clearDB() {
  Track.remove({}, function(err) {
    if (err) throw err;
    console.log('tracks removed');
  });
}



