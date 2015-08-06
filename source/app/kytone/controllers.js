kytoneApp.controller('postersCtrl', ['$scope', 'Posters', function($scope, Posters){
  $scope.posters = Posters.query();

  $scope.openPost = function(outerIndex, innerIndex) {
    console.log(outerIndex, innerIndex);
  }
}])