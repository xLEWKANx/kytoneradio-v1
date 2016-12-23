'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlList from './views/list.html'
import templateUrlUpload from './views/upload.html'
import moment from 'moment'
import undeerscore from 'underscore'

const app = angular.module('com.module.files.routes', [])

const SECONDS_TO_PIXEL = (1200 / (24 * 60 * 60))
const TIME_NOW = Date.now()
const TINE_END = function(time) {
  return +moment(time)
}

app.config(($stateProvider) => $stateProvider
  .state('app.files', {
    abstract: true,
    url: '/files',
    templateUrl: templateUrlMain,
  })
  .state('app.files.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: function listCtrl (tracks, TracksService, Player, Playlist, $q) {

      tracks.forEach((track) => {
        console.log("track", track)
        track.expanded = false
        track.style = {
          height: timeToPx(track.duration),
          color: 'red',
          overflow: 'hidden'
        }
      })

      let playlist = [{
        endTime: moment().startOf('day').toDate(),
        isMock: true,
        style: {
          height: 0,
          color: "yellow",
          border: 'none',
          display: 'none'
        }
      }]

      if (_.last(playlist).endTime < Date.now()) {
        let lastPlayedSeconds = (TIME_NOW - TINE_END(_.last(playlist).endTime)) / 1000;

        playlist.push({
          isMock: true,
          endTime: moment().toDate(),
          style: {
            height: timeToPx(lastPlayedSeconds),
            color: "yellow",
          }
        })
      }

      this.tracklistSortable = {
        clone: true,
        itemMoved: changePosiion,
        orderChanged: changePosiion,
        containment: '#grid-container'
      }
      this.playlistSortable = {
        allowDuplicates: true,
        containment: '#grid-container'
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

      this.storage = { tracks, playlist }
      this.moment = moment

      function changePosiion(object) {
        console.log('change', object)
      }

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
        startingDay: 1
      }
      this.formats = [
        'dd.MM.yyyy'
      ]
      this.format = this.formats[ 0 ]

      function timeToPx(time) {
        return `${SECONDS_TO_PIXEL * time}px`;
      }

    },
    resolve: {
      tracks: (TracksService) => TracksService.getTracks(),
      Player: (PlayerService) => PlayerService.getPlayer()
    },
  })
  .state('app.files.upload', {
    url: '/upload',
    templateUrl: templateUrlUpload,
    controllerAs: 'ctrl',
    controller: function uploadCtrl (CoreService) {
      // this.uploader = new FileUploader({
      //   url: `${CoreService.env.apiUrl}/containers/files/upload`,
      //   formData: [ {
      //     key: 'value',
      //   } ],
      // })
    },
  })
  .state('app.files.delete', {
    url: '/:fileName/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: function deleteCtrl ($stateParams, $state, FileService) {
      FileService.delete($stateParams.fileName,
        () => $state.go('^.list'),
        () => $state.go('^.list')
      )
    },
  })
)
