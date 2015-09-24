var playlist = require('../../service/playlist'),
    Track = require('../../server/models/track.js'),
    path = require('path'),
    config = require('../../server/config');
var mockObject = {},
    mockFile = ('01.mp3');


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
  it('should async get metadata', function(done) {
    expect(playlist.getMetadata).toBeDefined();
    playlist.getMetadata(mockFile).then(
      function(meta) {
        expect(meta).toEqual(jasmine.any(Object));
        done();
      },
      function(err) {
        expect(err).toBe(null);
        done();
      }
    );
  });
  it('should set order to meta object', function() {
    expect(playlist.setOrder).toBeDefined();
    var orderedObject = playlist.setOrder(mockObject);
    expect(orderedObject.order).toEqual(1);
    exoect(orderedObject.daytime).toBeDefined();
  });
  it('should save tracks to bd', function(done) {
    expect(playlist.saveTrackToDB).toBeDefined();
    playlist.saveTrackToDB(mockObject)
    Track.find({}, function(err, query) {
      expect(err).toBe(null);
      expect(query.length).toEqual(1);
      done();
    })
  });
  it('should send collection with playlist', function() {
    expect(playlist.createSchedule).toBeDefined();
    var collection = playlist.createSchedule();
    expect(collection.duration).toEqual(jasmine.any(Nubmer));
    expect(collection.artist).toBeDefined();
    expect(collection.title).toBeDefined();
  });
  it('should save m3u playlist', function(done) {
    expect(playlist.savePlaylist).toBeDefined();

  })
})