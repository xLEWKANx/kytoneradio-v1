(function(){
  'use strict';

  angular.module('kytoneApp', [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngTouch',
    'ngResource',
    'slick'
  ]);

  angular.module('kytoneApp').config(config);

  /* @ngInject */

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/posters', {
        // templateUrl: 'partials/postersLine',
        // controller: 'postersCtrl'
      })
      .otherwise({redirectTo: '/'});
  }
})();

