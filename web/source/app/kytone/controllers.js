(function(){
  'use strict';

  angular.module('kytoneApp')
    .controller('slidersCtrl', sliderCtrl)
    .controller('postersCtrl', posterCtrl)
    .controller('postCtrl', postCtrl);

  function sliderCtrl($scope){
    var vm = this;

    vm.slidersArr = $ctx.slidersCfg;
  }

  function posterCtrl($scope, Posters, postFunc){
    var vm = this;
    vm.postersArr = Posters.query(function(){
      $scope.$parent.slider.loaded = true;
    });
    vm.elemReady = false;
    vm.openPost = postFunc.openPost;
  }

  function postCtrl($scope, postData, postFunc){
    var vm = this;
    vm.postData = postData;
    vm.getContent = postFunc.getHtmlContent;
    vm.isOpened = postFunc.isOpened;
    vm.closePost = postFunc.closePost;
  }
})();

