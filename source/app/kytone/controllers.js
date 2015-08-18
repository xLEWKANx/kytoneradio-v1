(function(){
  'use strict';

  angular.module('kytoneApp')
    .controller('slidersCtrl', sliderCtrl)
    .controller('postersCtrl', posterCtrl)
    .controller('postCtrl', postCtrl);

  function sliderCtrl($scope, postFunc){
    var vm = this;

    vm.slidersArr = $ctx.slidersCfg;
    vm.openPost = openPost;

    function openPost(outerIndex, innerIndex) {
      postFunc.openPost(outerIndex, innerIndex);
      console.log('post opened', postFunc.isOpened());
    };
  }

  function posterCtrl($scope, Posters){
    var vm = this;

    vm.postersArr = Posters.query();
    vm.elemReady = false;
  }

  function postCtrl($scope, postData){
    var vm = this;

    vm.post = postData;
  }
})();

