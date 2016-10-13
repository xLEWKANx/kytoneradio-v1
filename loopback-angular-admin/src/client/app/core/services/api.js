'use strict'
import angular from 'angular'

function ApiService ($q, $http, ENV) {
  this.checkConnection = () => $q((resolve, reject) => {
    $http.get(`${ENV.apiUrl}/settings`)
      .success(resolve)
      .error(reject)
  })
}

angular
  .module('com.module.core.services.api', [])
  .service('ApiService', ApiService)
