(function(){
  'use strict';

  angular.module('kytoneApp')
    .directive('postersReady', postersReady);

  function postersReady() {
    return function(scope, element, attrs) {
      scope.$parent.elemReady = false;
      if (scope.$last){
        scope.$parent.elemReady = true;
      }
    };
  }
})();

