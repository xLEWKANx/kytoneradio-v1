var path = require('path');
var _ = require('lodash');

var _root = path.normalize(__dirname + '/../../');
var _env = process.env.NODE_ENV || 'development';
var _music = path.join(_root, '../music');

module.exports = _.merge(
  {
    env: _env,

    // Root path of server
    root: _root,
    paths: {
      views: path.join(_root, 'server','views'),
      public: path.join(_root,'public'),
      logs: path.join(_root, '..','logs'),
      music: {
        day: path.join(_music, 'day/tracks'),
        night: path.join(_music, 'night/tracks'),
        stable: path.join(_music, 'stable'),
        jingles: path.join(_music, 'jingles')
      },
      playlist: {
        day: path.join(_music, 'day/playlist.m3u'),
        night: path.join(_music, 'night/playlist.m3u')
      }
    },
    port: process.env.PORT || 3000

  },
  require('./' + _env + '.js')
);
