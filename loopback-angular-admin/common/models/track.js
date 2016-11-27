'use strict'

module.exports = function(Track) {
  Track.createFakeData = function (faker, count) {
    let name = `track # - ${count}.mp3`
    return Track.create({
      name: name,
      duration: Math.floor(Math.random() * 200),
      path: `storage/${name}`
    })
  }
}
