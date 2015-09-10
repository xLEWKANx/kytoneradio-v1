var path = require('path');

var config = {
  db: {
    url: 'mongodb://localhost/kytoneradio-test'
  },
  music: {
    path: path.join(__dirname, '..\\..\\test\\music')
  }
};

module.exports = config;
