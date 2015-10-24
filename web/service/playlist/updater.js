var scheduler = require('./scheduler.js');
var prevPl = scheduler.schedule.first;
var prevTr = scheduler.track.current;

module.exports = function(io) {

  io.on('connection', function() {
    io.emit('playlist', scheduler.schedule.stor);
    io.emit('track', prevTr);
  })

  io.on('error', function(err) {
    console.log(err);
    logger.log('error', 'socket io error', err);
  })

  setInterval(function() {
    // Playlist update
    var currentPl = scheduler.schedule.first;

    if (currentPl !== prevPl) {
      io.emit('playlist', scheduler.schedule.stor);
    }
    prevPl = currentPl;

    // Track update
    var currentTr = scheduler.track.current;

    if (currentTr !== prevTr) {
      io.emit('track', currentTr);
    }

    prevTr = currentTr;
  }, 3000)
}