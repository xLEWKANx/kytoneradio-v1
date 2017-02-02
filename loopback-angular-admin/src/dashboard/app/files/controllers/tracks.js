'use strict'
import angular from 'angular'
import moment from 'moment'
import _ from 'lodash'

const SECONDS_TO_PIXEL = (1200 / (24 * 60 * 60))
const TIME_NOW = Date.now() / 1000
const SECOND_FROM_START = moment().diff(moment().startOf('day'), 'seconds')

const TINE_END = function(time) {
  return +moment(time)
}


function timeTox(time) {
  return `${SECONDS_TO_PIXEL * time}px`
}

function TracksCtrl($scope, tracks, playlist, Track, TracksService, Player, Playlist, PlaylistService, $q) {

  this.playlist = playlist
  this.tracks = tracks
  this.changeTime = function(date) {
    PlaylistService.getPlaylist(date).then((res) => this.playlist = res)
  }

  this.scanDir = function() {
    Track.scanDir().$promise.then((tracks) => {
      this.tracks = tracks
    })
  };

  this.addItemToPlaylist = function(item) {
    let playlistItem = angular.copy(item)

    playlistItem.$prototype$addToPlaylist().then((responce) => {
      this.dt = responce.startTime
    }).catch((err) => {
      console.error('error', err)
    })
  }

  this.delete = function(item) {
    console.log(item)
    Playlist.deleteById({
      id: item.id
    }).$promise.then(() => {
      PlaylistService.getPlaylist(this.date).then((res) => this.playlist = res)
    })
  }
  this.date = new Date()
  $scope.$watch(() => this.dt, (date) => {
    this.changeTime(date)
  });

  this.formatTime = (date) => {
    return moment(date).format("HH:mm")
  }

  this.play = function() {
    Player.play();
  }
  this.stop = function() {
    Player.stop();
  }

  this.clearPlaylist = function() {
    PlaylistService.clear()
      .then(() => PlaylistService.getPlaylist(this.date).then((res) => this.playlist = res))
  }

  this.storage = { tracks }
  this.moment = moment
  this.formats = [
    'dd.MM.yyyy'
  ]
  this.format = this.formats[ 0 ]
  this.today = () => {
    this.dt = moment()
  }
  this.today()

  this.clear = () => {
    this.today()
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


}

angular
  .module('com.module.files.controllers.tracks', [])
  .controller('TracksCtrl', TracksCtrl)
