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
  console.log(timeToPx(SECOND_FROM_START))

  this.play = function() {
    Player.play();
  }
  this.stop = function() {
    Player.stop();
  }

  this.storage = { tracks }
  this.moment = moment

  this.today = () => {
    this.dt = moment().format('DD.MM.YYYY')
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
  this.formats = [
    'dd.MM.yyyy'
  ]
  this.format = this.formats[ 0 ]

}

angular
  .module('com.module.files.controllers.tracks', [])
  .controller('TracksCtrl', TracksCtrl)
