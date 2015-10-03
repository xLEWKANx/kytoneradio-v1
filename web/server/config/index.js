var path = require('path');
var _ = require('lodash');

var _root = path.normalize(__dirname + '/../../');
var _env = process.env.NODE_ENV || 'development';
var _music_dir = path.join(_root, '../music');

var _day = path.join(_music_dir, './day');
var _night = path.join(_music_dir, './night');

module.exports = _.merge(
  {
    env: _env,

    // Root path of server
    root: _root,
    paths: {
      views: path.join(_root, 'server','views'),
      public: path.join(_root,'public'),
      logs: path.join(_root, '..','logs'),
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
    },
    port: process.env.PORT || 3000

  },
  require('./' + _env + '.js')
);
