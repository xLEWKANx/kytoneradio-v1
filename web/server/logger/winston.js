var winston = require('winston');
var config = require('../config');

var logger_config = {
 levels: {
   info: 0,
   server: 1,
   data: 2,
   warn: 3,
   error: 4
 },
 colors: {
   info: 'cyan',
   server: 'green',
   data: 'grey',
   warn: 'yellow',
   error: 'red'
 }
};


var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
         colorize: true
      }),
      new (winston.transports.File)({ filename: config.paths.logs + '/server.log' })
    ],
    levels: logger_config.levels,
    colors: logger_config.colors
});


module.exports = logger;