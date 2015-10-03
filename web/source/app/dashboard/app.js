$('#day.set-playlist').click(function() {
  $.get('/api/playlist/day/set', function(data) {
    $('.info-box').text(data);
  })
});

$('#night.set-playlist').click(function() {
  $.get('/api/playlist/night/set', function(data) {
    $('.info-box').text(data);
  })
});