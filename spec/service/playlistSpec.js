var playlist = require('../../service/playlist'),
    Track = require('../../server/models/track.js');
var mockObject = {};

var cbTest = function(arg) {
  expect(arg).toBeDefined();
  expect(arg).not.toBe(null);
};

describe("Playlist", function() {
  it('should async scan directory with and return promise', function(done) {
    expect(playlist.scanDir).toBeDefined();
    var promise = playlist.scanDir();
    promise.then(
      function(arg) {
        expect(arg).toBeDefined();
        done();
      },
      function(err) {
        expect(err).toBe(null);
        done();
      }
    );
  });
})