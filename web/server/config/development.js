var path = require('path');

var _root = path.normalize(__dirname + '/../../');
var _music_dir = path.join(_root, '../music');

var _day = path.join(_music_dir, './day');
var _night = path.join(_music_dir, './night');

var config = {
  db: {
    url: 'mongodb://admin:lolka@ds059672.mongolab.com:59672/kytoneradio'
  },
  paths: {
    day: _day,
    night: _night,
    stable: path.join(_music_dir, 'stable'),
    jingles: path.join(_music_dir, 'jingles'),
    music: {
      day: path.join(_day, './tracks'),
      night: path.join(_night, './tracks')
    },
    playlist: {
      day: path.join(_day, 'day.m3u'),
      night: path.join(_night, 'night.m3u')
    }
  }
}

module.exports = config;
