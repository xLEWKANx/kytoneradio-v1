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
      isOpened: isOpened,
      getHtmlContent : getHtmlContent
    };
    var lastScrollTop = 0;
    return service;

    function openPost(outerIndex, innerIndex) {
      
      var post = Posters.get(
        {
          outerIndex: outerIndex,
          innerIndex: innerIndex
        },
        function() {
          postData.currentPost = post[0];
          if(post){
            console.log(postData.currentPost);
            postData.postOpened = true;
            // lock scrolling and view
            lastScrollTop = $(window).scrollTop();
            $(window).scrollTop(0);
            document.body.style.overflow = 'hidden';
          }
        }
      );
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
      document.body.style.overflow = '';
    }

    function isOpened() {
      return postData.postOpened;
    }
  }
})();
