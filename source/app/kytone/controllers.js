kytoneApp.controller('slidersCtrl', ['$scope', 'Sliders', function($scope, Sliders){
  $scope.sliders = $ctx.slidersCfg;

  $scope.openPost = function(outerIndex, innerIndex) {
    console.log(outerIndex, innerIndex);
  }
}]);

kytoneApp.controller('postersCtrl', ['$scope', 'Posters', function($scope, Posters){
  $scope.posters = Posters.query();
  $scope.elemReady = false;
  console.log('controller scope ',$scope.elemReady);
}])
