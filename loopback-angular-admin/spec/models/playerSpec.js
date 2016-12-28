/* eslint-env jasmine, node */

describe('Player test', () => {
  console.log('Player test')
  let app, Player, player
  beforeAll((done) => {
    app = require('../../server/server')
    Player = app.models['Player']
    app.on('inititated', () => {
      done()
    })
  })

  // it('Player bootstrap', (done) => {
  //   Player.bootstrap((err, client) => {
  //     player = client
  //     expect(err).toBe(null)
  //     done()
  //   })
  // })
  //
  // it('Start of playlist', (done) => {
  //   Player.play((err, msg) => {
  //     expect(err).toBe(null)
  //     console.log('msg', msg)
  //     done()
  //   })
  // })

  // it('Add tracks to playlist', (done) => {
  //   Player.addTracks(['04. Empty Tombs.mp3', 'Trying Science - Vacation for Snakes - 05 0FPS.mp3'], (err, msg) => {
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
  // it('move track {from} position {to} position', (done) => {
  //   Player.moveTrack(1, 2, (err, msg) => {
  //     expect(err).toBe(null)
  //     console.log('msg', msg)
  //     done()
  //   })
  // })
  it('return status', (done) => {
    Player.getStatus((err, msg) => {
      expect(err).toBe(null)
      console.log('status', msg)
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
