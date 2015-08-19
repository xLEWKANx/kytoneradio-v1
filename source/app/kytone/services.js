(function(){
  'use strict';

  angular.module('kytoneApp')
    .factory('Posters', Posters)
    .factory('postData', postData)
    .factory('postFunc', postFunc);

  function Posters($resource) {
    return $resource('/api/posters/:outerIndex/:innerIndex', {}, {
      'get': {method: 'GET', isArray: true}
    });
  }

  function postData(){
    var postData = {
      postOpened: false,
      currentPost: {}
    };

    return postData;
  }

  function postFunc(Posters, postData){
    var service = {
      openPost: openPost,
      closePost: closePost,
      isOpened: isOpened
    };

    return service;

    function openPost(outerIndex, innerIndex) {
      
      var post = Posters.get(
        {
          outerIndex: outerIndex,
          innerIndex: innerIndex
        },
        function() {
          postData.currentPost = post[0];
          if(post)
          console.log(postData.currentPost);
          postData.postOpened = true;
        }
      );
    }

    function closePost() {
      postData.currentPost = {};
      postData.postOpened = false;
    }

    function isOpened() {
      return postData.postOpened;
    }
  }
})();
