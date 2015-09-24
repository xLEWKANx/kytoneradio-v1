var fs = require('fs'),
    path = require('path'),
    logger = require('../../server/logger/winston'),
    config = require('../../server/config');


module.exports = {
  createPlaylist: createPlaylist
};

function createPlaylist(files) {

  var playlistPath  = path.join(config.music.path, 'playlist.m3u');
  files = files.map(function(file) {
    return path.join(config.music.path, file);
  });
  fs.writeFileSync(playlistPath, files.join('\n'));
  logger.log('data', 'playlist created with ', files.length, ' files');
  return files;
};
