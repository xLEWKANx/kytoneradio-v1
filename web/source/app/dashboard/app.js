$('#day.set-playlist').click(function() {
  $.get('/api/playlist/day/set', function(data) {
    $('.info-box').text(data);
  })
});

$('#night.set-playlist').click(function() {
  $.get('/api/playlist/night/set', function(data) {
    alert('callback', data);
    console.log(data);
  },'json').done(function(data) {
     alert('done', data);
    console.log(data);
  })
});