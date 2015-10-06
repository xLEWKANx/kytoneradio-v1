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

connection.on('close', function() {
  logger.log('info','telnet connection closed');
});

connection.on('error', function() {
  logger.log('error', 'telnet connection error');
});

connection.on('connect', function() {
  logger.log('info', 'telnet connection established');
});

connection.on('timeout', function() {
  logger.log('info', 'telnet connection timeout');
  connection.destroy();
})

module.exports = {
  nextTracks: nextTracks,
  reload: reload
}

function nextTracks(playlist) {

  var promise = new Promise(function(resolve, reject) {
    connection.connect(params);

    var cmd = playlist + '.next';
    connection.exec(cmd, function(response){

      if (!!(response.indexOf('ERROR') + 1)) {
        reject('telnet next track exucation error');
      }

      var result = response.split('\n');

      if (result[0].indexOf('[playing]') + 1)
        result[0] = result[0].slice(10);
      if (result[1].indexOf('[ready]') + 1)
        result[1] = result[1].slice(7);

      resolve(result);
      connection.end();
    })
  });
  return promise;
}

function reload(playlist) {
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
