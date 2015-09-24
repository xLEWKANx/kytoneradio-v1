var path = require('path');

var config = {
  db: {
    url: 'mongodb://admin:lolka@ds059672.mongolab.com:59672/kytoneradio'
  },
  music: {
    path: path.normalize('D:\\music\\chaotic\\Converge\\2012 - All We Love We Leave Behind (Deluxe Edition)')
  }
}

module.exports = config;
