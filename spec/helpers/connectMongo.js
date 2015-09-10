process.env.NODE_ENV = 'test';

var config = require('../../server/config');
var mongoose = require('mongoose');


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
     console.log('test music', config.music.path);
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