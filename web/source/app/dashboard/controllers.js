(function(){
  'use strict';

  angular.module('dashboard')
    .controller('dayCtrl', dayCtrl);
    // .controller('nightCtrl', nightCtrl)


  function dayCtrl($scope, DayPlst){
    var vm = this;

    vm.tracks = DayPlst.get({
      daytime: 'day'
    });
    console.log(vm.playlist);
  }

})();

