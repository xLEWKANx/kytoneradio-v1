var fs = require('fs');
var config = require('../config');
var moment = require('moment');

var logpath = config.paths.logs + '/server.log';

// remove old server.log
// if exists
fs.exists(logpath, function (exists) {
   if (exists)
      fs.unlinkSync(logpath);

});

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
         var obj = JSON.parse(logs[i]);
         var obj_time = moment(obj.timestamp);

         obj.time = obj_time.format('HH:mm:ss, MMM Do YYYY');
         obj.fromnow = obj_time.fromNow();

         data.push(obj);
      }

      callback( data.reverse().splice(0,n) );
      
   })


}