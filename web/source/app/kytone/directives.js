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

  angular.module('kytoneApp')
    .directive('showOnLoad',function(){
      return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {
        // }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, elem, iAttrs, controller) {
          $scope.$watch('slider.loaded', function (nv,ov) {
            if (nv)
              angular.element(elem).addClass('loaded');
            else
              angular.element(elem).removeClass('loaded');
          })
        }
      }
    })

})();

