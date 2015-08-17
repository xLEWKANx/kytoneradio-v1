var fs = require('fs');
var config = require('../config');

var logpath = config.paths.logs + '/server.log';

module.exports.clear = function(cb){
   var callback = cb || function(){};

   fs.unlink(logpath, callback);

}

module.exports.getlogs = function(n,cb){
   var callback = cb || function(){};
   var max = n || 10;
   var data = [];

   fs.readFile(logpath, { encoding: 'utf-8' },function(err,rawlogs){
      var logs = rawlogs.split('\n');

      for (var i in logs){
         if (logs[i] == '')
            continue
         else
            data.push(JSON.parse(logs[i]))
      }

      callback( data.splice(0,n) );
      
   })


}