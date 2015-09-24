//context manager
//главная цель - хранить обьект контекст для доступа с клиентской стороны
var colors = require('colors');
var fs = require('fs');

var logger = require('../../server/logger/winston');

var parser = require('./parser');

module.exports.save = function(cfg,cb){
  var callback = cb || function(){}

  fs.writeFile('service/context/default.cfg', cfg, function (err) {
  if (err) throw err;
    logger.data('Context data updated');

    parser(cfg, function(parsed){
      fs.writeFile('public/app/context.js',
        'var $ctx = '
        + JSON.stringify(parsed),
        function(){
          callback();
        })
    })

  })
}

module.exports.read = function(cb){
  fs.readFile('service/context/default.cfg', cb);
}


