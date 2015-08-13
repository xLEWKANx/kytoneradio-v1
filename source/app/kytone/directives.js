kytoneApp.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    scope.$parent.elemReady = false;
    console.log(scope.$parent.elemReady);
    if (scope.$last){
      scope.$parent.elemReady = true;
      console.log('must be ready', scope.$parent.elemReady);
    }
  };
})
