var scheduler = require('./scheduler.js');
var prev = scheduler.schedule.first;

module.exports = function(io) {

  io.on('connection', function() {
    io.emit('playlist', scheduler.schedule.stor);
  })

  setInterval(function() {
    var current = scheduler.schedule.first;

    if (current !== prev) {
      io.emit('playlist', scheduler.schedule.stor);
    }
    prev = current;

  }, 1000)
}