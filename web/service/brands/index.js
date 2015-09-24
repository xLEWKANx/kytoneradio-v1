var fs = require('fs'),
    path = require('path'),
    config = require ('../../server/config');


files = fs.readdirSync(path.join(config.root, '/source/img/brands/'));


module.exports.getSrc = function(){
  return files.map(function(e) {
      return 'img/brands/' + e;
  })
}