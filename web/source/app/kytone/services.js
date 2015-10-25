(function(){
  'use strict';

  angular.module('kytoneApp')
    .factory('Posters', Posters)
    .factory('Schedule', Schedule)
    .factory('postData', postData)
    .factory('postFunc', postFunc)
    .factory('socket', socket);

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

  function postFunc(Posters, postData, $location){
    var service = {
      openPost: openPost,
      closePost: closePost,
      isOpened: isOpened,
      getHtmlContent : getHtmlContent
    };
    var lastScrollTop = 0;
    return service;

    function openPost($event, outerIndex, innerIndex, startCoords) {
      console.log($event.clientX == startCoords.x || outerIndex === 0);
      if ($event.clientX == startCoords.x || outerIndex === 0) {
        console.log('click');
        var post = Posters.get(
          {
            outerIndex: outerIndex,
            innerIndex: innerIndex
          },
          function() {
            postData.currentPost = post[0];
            if (post[0].local){
              postData.postOpened = true;
              // lock scrolling and view
              lastScrollTop = $(window).scrollTop();
              $(window).scrollTop(0);
            } else {
              $location.path = post[0].outerUrl;
            }
          }
        );
      }
    }

    function getHtmlContent(){
      return postData.currentPost.content
    }

    function closePost() {
      postData.currentPost = {};
      postData.postOpened = false;
      // reset locking
      $(window).scrollTop(lastScrollTop);
      lastScrollTop = 0;
    }

    function isOpened() {
      return postData.postOpened;
    }
  }

  function Schedule($resource) {
    return $resource('/api/playlist/next', {}, {
      'get': {method: 'GET', isArray: true}
    });
  }

  function socket(socketFactory) {
    return socketFactory({
    });
  };

})();
