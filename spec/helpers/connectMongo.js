var config = require('../../server/config');
var mongoose = require('mongoose');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'development';

beforeAll(function (done) {

 function clearDB() {
   for (var i in mongoose.connection.collections) {
     mongoose.connection.collections[i].remove(function() {});
   }
   return done();
 }

 if (mongoose.connection.readyState === 0) {
   mongoose.connect(config.db.url, function (err) {
     if (err) {
       throw err;
     }
     console.log('mongoose connected');
     return clearDB();
   });
 } else {
   return clearDB();
 }
});

afterAll(function (done) {
 mongoose.disconnect();
 console.log('\nmongoose disconnected');
 return done();
});