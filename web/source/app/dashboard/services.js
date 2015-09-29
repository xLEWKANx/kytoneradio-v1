(function(){
  'use strict';

  angular.module('dashboard')
    .factory('DayPlst', DayPlst)
    // .factory('NightPlst', NightPlst)

  function DayPlst($resource) {
    return $resource('/api/player/:daytime', {}, {
      'get': {method: 'GET', isArray: true}
    });
  }

})();
