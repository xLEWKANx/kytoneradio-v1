var path = require('path');

var config = {
  db: {
    url: 'mongodb://localhost/kytoneradio-test'
  },
  music: {
    path: path.normalize('D:\\music\\chaotic\\Converge\\2012 - All We Love We Leave Behind (Deluxe Edition)')
  }
}

module.exports = config;
