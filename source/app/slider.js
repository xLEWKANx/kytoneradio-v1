
$(function(){
  var sliders = ['cover-first','cover-second','cover-third'];

  $.each(sliders, function(){
    setup(this);
  });
});

// -> cover-first
var setup = function(slider){
  var $slider = $('#'+slider);

  $.ajax({
    type: 'GET',
    url:'/slider/'+slider
  })
    .done(function(data) {
    //  console.log('data\n',data);
// Append items
      $slider
        .html(data);

// Reload carousel
      $slider
        .on('jcarousel:lastin', 'li', function(event, carousel) {
        })
        .jcarousel({
          wrap: 'circular'
        })
        //.jcarouselControl({
        //
        //})
        .jcarouselAutoscroll({
          target: '+=1',
          interval: 5000,
          autostart: true
        })
      ;


      });
  }