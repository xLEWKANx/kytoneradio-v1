var path = require('path');
var _ = require('lodash');

var _root = path.normalize(__dirname + '/../../');
var _env = process.env.NODE_ENV || 'development';

module.exports = _.merge(
  {
    env: _env,

    // Root path of server
    root: _root,
    paths: {
      views: path.join(_root, 'server','views'),
      public: path.join(_root,'public'),
      logs: path.join(_root, '..','logs')
    },
    port: process.env.PORT || 3000

  },
  require('./' + _env + '.js')
);
