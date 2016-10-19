'use strict'
import angular from 'angular'

function RouteCtrl (ApiService, AppAuth, $location) {
  ApiService.checkConnection()
    .then(() => {
      console.log('ApiService.checkConnection success')
      if (!AppAuth.currentUser) {
        $location.path('/login')
      } else {
        $location.path('/app')
      }
    })
    .catch((err) => {
      console.log(`ApiService.checkConnection err: ${err}`)
      $location.path('/error')
    })
}

angular
  .module('com.module.core.controllers.router', [])
  .controller('RouteCtrl', RouteCtrl)
