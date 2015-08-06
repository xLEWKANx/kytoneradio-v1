var kytoneApp = angular.module('kytoneApp', [
  'ngRoute',
  'ngAnimate',
  'ngAria',
  'ngCookies',
  'ngTouch',
  'ngResource',
  'slick'
]);

kytoneApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/posters', {
      templateUrl: 'partials/postersLine',
      controller: 'postersCtrl'
    })
    .otherwise({redirectTo: '/'});
}]);