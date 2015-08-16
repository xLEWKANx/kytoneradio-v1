kytoneApp.controller('slidersCtrl', ['$scope', 'Post', function($scope, Post){
  $scope.sliders = $ctx.slidersCfg;

  $scope.openPost = function(outerIndex, innerIndex) {
    Post.openPost(outerIndex, innerIndex);
    console.log('post opened', Post.isOpened());
  };
}]);

kytoneApp.controller('postersCtrl', ['$scope', 'Posters', function($scope, Posters){
  $scope.posters = Posters.query();
  $scope.elemReady = false;
}])

kytoneApp.controller('postCtrl', ['$scope', 'Post', function($scope, Post){
  $scope.post = Post.currentPost;
  $scope.isOpened = Post.isOpened();
  console.log('post opened', $scope.isOpened);
}]);
