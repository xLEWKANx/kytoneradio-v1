kytoneApp.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    scope.$parent.elemReady = false;
    if (scope.$last){
      scope.$parent.elemReady = true;
    }
  };
})
