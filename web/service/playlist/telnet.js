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

module.exports = {
  nextTracks: nextTracks,
  reload: reload
}

function nextTracks(playlist) {
  playlist = telnetDaytime(playlist);

  var promise = new Promise(function(resolve, reject) {
    connection.connect(params);

    var cmd = playlist + '.next';
    connection.exec(cmd, function(response){

      if (!!(response.indexOf('ERROR') + 1)) {
        reject('telnet next track exucation error');
      }

      var result = response.split('\n').map(function(elem) {
        return elem.replace(/^\[\w+\]\s/, '');
      });

      resolve(result);
      connection.end();
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
        reject('telnet reload exucation error');
      }
      resolve(response.split('\n'));
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