var net = require('net');
var config = require('../../server/config')

var client = net.connect({path: path.join(config.liquidsoap, 'socket')},
  function() { //'connect' listener
    console.log('connected to server!');
    client.write('help');
  }
);

client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('disconnected from server');
});