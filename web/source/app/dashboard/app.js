$('#day.set-playlist').click(function() {
  $.get('/api/playlist/day/set', function(data) {
    $('.info-box').text(data);
  })
});

$('#night.set-playlist').click(function() {
  $.get('/api/playlist/night/set', function(data, status) {
    $('.info-box').text(data);
  })
});

$('#day.reload-playlist').click(function() {
  $.get('/api/playlist/day/reload', function(data) {
    $('.info-box').text(data);
    });
  })
});
$('#night.reload-playlist').click(function() {
  $.get('/api/playlist/night/reload', function(data) {
    $('.info-box').text(data);
  })
});