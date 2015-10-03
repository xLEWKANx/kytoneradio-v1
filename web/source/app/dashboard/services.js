(function(){
  'use strict';

  angular.module('dashboard')
    .factory('DayPlst', DayPlst)
    // .factory('NightPlst', NightPlst)
    .factory('set', set)

  function DayPlst($resource) {
    return $resource('/api/playlist/:daytime', {}, {
      'get': {method: 'GET', isArray: true}
    });
  }

  function set($http, $routeParams) {
    return function(daytime) {
      $http.get('/api/playlist/' + daytime + '/set');
    }
  }

})();
