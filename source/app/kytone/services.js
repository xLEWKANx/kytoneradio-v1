kytoneApp.factory('Posters', ['$resource',
  function($resource) {
    return $resource('/api/posters/:outerIndex/:innerIndex', {}, {
      'get': {method: 'GET', isArray: true}
    });
  }
]);

kytoneApp.factory('Post', ['Posters',
  function(Posters){
    var postOpened = false;
    var currentPost = {};
    return {
      openPost: function(outerIndex, innerIndex) {
        postOpened = true;
        var post = Posters.get(
          {outerIndex: outerIndex, innerIndex: innerIndex},
          function() {
            currentPost = post[0];
            console.log(currentPost);
          }
        );
      },
      closePost: function() {
        currentPost = {};
        postOpened = false;
      },
      isOpened: function() {
        return postOpened;
      }
    };
  }
]);