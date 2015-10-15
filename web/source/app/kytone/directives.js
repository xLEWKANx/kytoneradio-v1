(function(){
  'use strict';

  angular.module('kytoneApp')
    .directive('myPosterPlace', myPosterPlace);

  function myPosterPlace() {
    return function(scope, element, attrs) {
      scope.$parent.elemReady = null;
      if (scope.$last) {
        scope.$parent.elemReady = true;
      }
      angular.element(element).find('img').on('load', function() {
        scope.$parent.$parent.posters.count -= 1;
        if (scope.$parent.$parent.posters.count === -10) {
          var dir = scope.$parent.$parent.$parent.$odd ? 'slickNext' : 'slickPrev'
          $(angular.element(element).parent().parent().parent()).slick(dir);
          angular.element(element).parent().parent().parent().removeClass('hidden');
        }
      });
    
    };
  }

})();
