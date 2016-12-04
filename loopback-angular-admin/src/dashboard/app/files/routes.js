'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlList from './views/list.html'
import templateUrlUpload from './views/upload.html'
import moment from 'moment'

const app = angular.module('com.module.files.routes', [])

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
    controller: function listCtrl (tracks) {
      console.log('tracks', tracks)
      tracks.forEach((track) => {
        track.expanded = false
        track.style = {
          height: (2400 / 86400) * track.duration + 'px',
          color: 'red',
          overflow: 'hidden'
        }
      })

      this.itemClick = function(item) {
        console.log('privet', item)
        item.style = item.style.expanded ? { height: (2400 / 86400) * item.duration + 'px' } : { height: '100px' }

      }

      let playlist = []
      this.storage = { tracks, playlist }
      this.moment = moment
      function changePosiion(object) {
        console.log('change', object)
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

      this.today = () => {
        this.dt = moment().format('DD.MM.YYYY')
      }

      this.today()
      this.clear = () => {
        this.dt = null
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

    },
    resolve: {
      tracks: (TracksService) => TracksService.getTracks()
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
