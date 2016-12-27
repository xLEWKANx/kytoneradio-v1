'use strict'
import angular from 'angular'
import moment from 'moment'

const SECONDS_TO_PIXEL = (1200 / (24 * 60 * 60))
const TIME_NOW = Date.now() / 1000
const SECOND_FROM_START = moment().diff(moment().startOf('day'), 'seconds')
const TINE_END = function(time) {
  return +moment(time)
}

function timeToPx(time) {
  return `${SECONDS_TO_PIXEL * time}px`
}

function TracksCtrl($scope, tracks, Track, TracksService, Player, Playlist, $q) {
  this.containerStyle = {
    paddingTop: timeToPx(SECOND_FROM_START)
  }
  console.log(timeToPx(SECOND_FROM_START))

  tracks.forEach((track) => {
    track.expanded = false
    track.style = {
      height: timeToPx(track.duration),
      color: 'red',
      overflow: 'hidden'
    }
  })

  let playlist = []


  this.tracklistSortable = {
    clone: true,
    itemMoved: changePosiion,
    orderChanged: changePosiion,
    containment: '#grid-container',
    accept: restrictMoving,
  }
  this.playlistSortable = {
    allowDuplicates: true,
    containment: '#grid-container'
  }

  function changePosiion(object) {
    let item = object.source.itemScope.item
    let playlistItem = new Playlist(item)
    console.log('change', object)
    console.log('playlist', playlist, playlist.indexOf(item))
  }

  function restrictMoving(source, dest) {
    console.log(source, dest)
    return dest.index !== 0 && dest.index !== 1
  }


  this.play = function() {
    Player.play();
  }
  this.stop = function() {
    Player.stop();
  }

  this.savePlaylist = function(playlist) {
    let realTracks = playlist.filter((track) => !track.isMock)
    console.log('playlist', realTracks)

    TracksService.rebuildPlaylist(realTracks)
  }

  this.delete = (index) => {
    playlist.splice(index, 1)
  }

  this.storage = { tracks, playlist }
  this.moment = moment

  this.today = () => {
    this.dt = moment().format('DD.MM.YYYY')
  }

  this.today()
  this.clear = () => {
    this.today()
  }
  this.disabled = (date, mode) => {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
  }

  this.open = ($event) => {
    $event.preventDefault()
    $event.stopPropagation()
    this.opened = true
  }
  this.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1,
    minDate: Date.now(),
  }
  this.formats = [
    'dd.MM.yyyy'
  ]
  this.format = this.formats[ 0 ]

}

angular
  .module('com.module.files.controllers.tracks', [])
  .controller('TracksCtrl', TracksCtrl)
