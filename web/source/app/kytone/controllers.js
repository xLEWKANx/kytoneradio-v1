(function(){
  'use strict';

  angular.module('kytoneApp')
    .controller('slidersCtrl', sliderCtrl)
    .controller('postersCtrl', postersCtrl)
    .controller('postCtrl', postCtrl)
    .controller('scheduleCtrl', scheduleCtrl);

  function sliderCtrl($scope){
    var vm = this;
    vm.slidersArr = $ctx.slidersCfg;
    for (var key in vm.slidersArr) {
      if (vm.slidersArr[key].isBig === "true") {
        vm.slidersArr[key].wrapperClass = 'cover-wrapper-big'
      }
    }
    console.log(vm.slidersArr);
  }

  function postersCtrl($scope, Posters, postFunc){
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

  function scheduleCtrl($scope, socket, Schedule) {
    var vm = this;
    socket.on('playlist', function(data) {
      vm.next = data;
    })
  }
})();

