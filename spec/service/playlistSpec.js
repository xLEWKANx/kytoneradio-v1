var playlist = require('../../service/playlist'),
    Track = require('../../server/models/track.js');

describe("Playlist", function() {
  it('should scan directory', function(done) {
    expect(playlist.scanDir).toBeDefined();
    playlist.scanDir();
    Track.find({}, function(err, results) {
      expect(err).toBe(null);
      expect(results.length).not.toBe(0);
      done();
    })
  });
  it('should clearDB', function(done) {
    expect(playlist.clearDB).toBeDefined();
    playlist.clearDB();
    Track.find({}, function(err, results) {
      expect(err).toBe(null);
      expect(results.length).toBe(0);
      done();
    })
  });
})