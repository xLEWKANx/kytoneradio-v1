var telnet = require('telnet-client'),
    logger = require('../../server/logger/winston');

var connection = new telnet();

var params = {
  host: '127.0.0.1',
  port: 1234,
  timeout: 1000,
  shellPrompt: '\r\n',
  echoLines: 0
};

connection.on('timeout', function() {
  logger.log('info', 'telnet connection timeout');
  connection.destroy();
})

connection.on('error', function() {
  logger.log('error', 'telnet connection error, check liquidsoap');
})
module.exports = {
  nextTracks, reload
}

function nextTracks(playlist) {
  playlist = telnetDaytime(playlist);

  var promise = new Promise(function(resolve, reject) {
    try {
      connection.connect(params);
    } catch (err) {
      console.log(err);
    }
    var result = {
      playing: null,
      ready: null,
      list: []
    }

    var cmd = playlist + '.next';
    connection.exec(cmd, function(response){

      if (!!(response.indexOf('ERROR') + 1)) {
        logger.log('error', 'telnet next tracks error!');
        reject('telnet next track exucation error');
      }
      var regEx = /^\[(\w*)\]\s/
      response.split('\n').forEach(function(elem) {
        if (elem.match(regEx)) {
          if (regEx.exec(elem)[1] === 'playing') {
            result.playing = elem.replace(regEx, '');
          }
          else if (regEx.exec(elem)[1] === 'ready') {
            result.ready = elem.replace(regEx, '');
            result.list.push(elem.replace(regEx, ''));
          }
        } else if (elem !== '' && elem !== 'END'){
          result.list.push(elem);
        } else {
          return;
        }
      });
      logger.log('info', 'telnet got next tracks');
      connection.end();
      resolve(result);
    })
  });
  return promise;
}

function reload(playlist) {

  playlist = telnetDaytime(playlist);

  var promise = new Promise(function(resolve, reject) {

    connection.connect(params);

    var cmd = playlist.concat('.reload');
    console.log(cmd);
    connection.exec(cmd, function(response){
      if (response.indexOf('ERROR') + 1) {
        logger.log('error', 'telnet next tracks error!');
        reject('telnet reload exucation error');
      }
      logger.log('info', 'telnet playlist reloaded');
      resolve(null);
      connection.end();
    })
  });
  return promise;
}

// Private methods

function telnetDaytime(daytime) {
  if (daytime === 'day') {
    return 'day(dot)m3u';
  } else if (daytime === 'night') {
    return 'night(dot)m3u';
  } else {
    logger.log('error', 'daytime is not defined');
    throw new Error('daytime not defined');
  }
}

