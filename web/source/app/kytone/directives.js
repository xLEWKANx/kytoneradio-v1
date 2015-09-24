(function(){
  'use strict';

  angular.module('kytoneApp')
    .directive('myPosterPlace', myPosterPlace);

  function myPosterPlace() {
    return function(scope, element, attrs) {
      scope.$parent.elemReady = false;
      if (scope.$last){
        scope.$parent.elemReady = true;
      }
    };
  }
})();

