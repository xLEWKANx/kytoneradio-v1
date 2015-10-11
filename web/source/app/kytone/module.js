(function(){
  'use strict';

  angular.module('kytoneApp', [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngTouch',
    'ngResource',
    'slick',
    'btford.socket-io'
  ]);

  angular.module('kytoneApp').config(config);

  /* @ngInject */

  function config($routeProvider, $locationProvider,$sceProvider) {
    $routeProvider
      .when('/posters', {
        templateUrl: 'partials/postersLine',
        controller: 'postersCtrl'
      })
      .otherwise({redirectTo: '/'});

      $sceProvider.enabled(false);

  }
})();