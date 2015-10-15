(function(){
  'use strict';

  angular.module('kytoneApp')
    .controller('slidersCtrl', slidersCtrl)
    .controller('postersCtrl', postersCtrl)
    .controller('postCtrl', postCtrl)
    .controller('scheduleCtrl', scheduleCtrl);

  function slidersCtrl($scope){
    var vm = this;
    vm.slidersArr = $ctx.slidersCfg;
    for (var key in vm.slidersArr) {
      if (vm.slidersArr[key].isBig === "true") {
        vm.slidersArr[key].wrapperClass = 'cover-wrapper-big'
      }
    }
  }

  function postersCtrl($scope, Posters, postFunc){
    var vm = this;
    vm.postersArr = Posters.query({outerIndex: $scope.$parent.$index + 1}, function() {
      vm.count = vm.postersArr.length;
    });
    vm.count = [];
    vm.elemReady = false;
    vm.startCoords = {}
    vm.writeCoords = function(x) {
      vm.startCoords.x = x.clientX
      vm.startCoords.y = x.clientY
    }
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
