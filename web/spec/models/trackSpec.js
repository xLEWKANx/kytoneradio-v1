var Track = require('../../server/models/track.js');

describe('playlist', function() {
  it('should create a model', function(done) {
    var Sample = {
        artist : ['artist'],
        album : 'album',
        albumartist : ['albumartist'],
        title : 'title',
        year : 'year',
        track : {},
        disk : {},
        genre : [],
        duration : 0,
        daytime: ''
    };
    Track.create(Sample, function(err, track) {
      expect(err).toBe(null);
      expect(track).toBeDefined();
      expect(track.duration).toBeDefined();
      done();
    });
  });
});