describe('sliderCtrl', function(){

  beforeEach(module('kytoneApp'));

  it('should create "poster" model with 2 poster', inject(function($controller) {
    var scope = {},
        ctrl = $controller('sliderCtrl', {$scope:scope});

    expect(scope.posters.length).toBe(2);
  }));

});