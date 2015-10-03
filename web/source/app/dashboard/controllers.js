(function(){
  'use strict';

  angular.module('dashboard')
    .controller('dayCtrl', dayCtrl);
    // .controller('nightCtrl', nightCtrl)


  function dayCtrl($scope, DayPlst, set){
    var vm = this;

    vm.set = function() {
      console.log(click);
    };
    vm.daytime = 'day';

    vm.tracks = DayPlst.get({
      daytime: 'day'
    });
  }

})();

