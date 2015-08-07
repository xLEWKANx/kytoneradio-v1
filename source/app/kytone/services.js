kytoneApp.factory('Posters', ['$resource',
  function($resource) {
    return $resource('/api/posters/:outerIndex');
  }
]);

kytoneApp.factory('Sliders', ['$resource',
  function($resource) {
    return $resource('/config/sliders/');
  }
]);