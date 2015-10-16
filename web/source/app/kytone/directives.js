(function(){
  'use strict';

  angular.module('kytoneApp')
    .directive('myPosterPlace', myPosterPlace)
    .directive('scroll', scroll);

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

  function scroll($timeout) {

    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        $timeout( function() {
          var elemWidth = angular.element(element)[0].clientWidth;
          var maxWitdh = $('#plPlace')[0].clientWidth;
          if(elemWidth > maxWitdh) {
            angular.element(element).addClass('track-scroll');
          }
        });
      }
    };
  }

})();
