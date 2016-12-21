/* eslint-env jasmine, node */
let app = require('../../server/server')
let Player = app.models['Player']

describe('Player test', () => {
  let player
  beforeAll((done) => {
    app.on('inititated', () => {
      done()
    })
  })

  it('Player bootstrap', (done) => {
    Player.bootstrap((err, client) => {
      player = client
      expect(err).toBe(null)
      done()
    })
  })

  it('Start of playlist', (done) => {
    Player.play((err, msg) => {
      expect(err).toBe(null)
      console.log('msg', msg)
      done()
    })
  })

  // it('Add tracks to playlist', (done) => {
  //   Player.addTracks(['04. Empty Tombs.mp3'], (err, msg) => {
  //     expect(err).toBe(null)
  //     console.log('msg', msg)
  //     done()
  //   })
  // })
  //
  // it('Remove tracks from playlist', (done) => {
  //   Player.removeTrack([1], (err, msg) => {
  //     expect(err).toBe(null)
  //     console.log('msg', msg)
  //     done()
  //   })
  // })
  it('move track {from} position {to} position', (done) => {
    Player.moveTrack(1, 2, (err, msg) => {
      expect(err).toBe(null)
      console.log('msg', msg)
      done()
    })
  })

  // it('Stop playing', (done) => {
  //   Player.stop((err, msg) => {
  //     expect(err).toBe(null)
  //     console.log('msg', msg)
  //     done()
  //   })
  // })

})
