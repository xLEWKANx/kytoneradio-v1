/**
 * Created by eagle on 2/12/15.
 */

$playlist = document.getElementById('playlist');

var socket = io.connect(document.location.host);

socket.on('update playlist new', function(data){
    //add data
    console.log('Adding new to pl', data);
    addtoplaylist(data);
});

socket.on('update playlist del', function(data){
    //removing data
    console.log('Removing items from pl', data);
    removefromplaylist(data);
});


function removefromplaylist(data){
    var tl = $('.timelist');
    var pl = $('.playlist');
    var index = 0;
    //find items
    var finded_event = pl.contents().filter(function(){
        for (var i in data){
            var removed = data[i];
            return $(this).text() === removed.eventname;
        }
    });
    var finded_time = tl.contents().filter(function(){
        for (var i in data){
            var removed = data[i];
            return $(this).text() === (removed.begintime.split(' ')[1])
        }
    })

    finded_event.fadeOut(function(){
        $(this).remove();
    });
    finded_time.fadeOut(function(){
        $(this).remove();
    });
}

function addtoplaylist(data){
    var tl = $('.timelist');
    var pl = $('.playlist');

    for (var i in data){
        var event = data[i];
        var event_time = '<li><span class="nubm">'+event.begintime.split(' ')[1]+'</span></li>';

        var event_title = '<li><span class="nubm">';
        if (event.onair)
            event_title += '<span style="color:#F00">ON AIR</span> ';
        event_title+= event.eventname + '</span></li>';

        $(event_time).hide().appendTo(tl).fadeIn();
        $(event_title).hide().appendTo(pl).fadeIn();
    }
}

