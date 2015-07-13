/**
 * Created by eagle on 12/23/14.
 */

//Clock
function clock() {
    var d = calcTime('+2');

    document.getElementById("clock").innerHTML =d.toString().split(' ')[4].substring(0,5) + ' Kyiv (+2 GMT) ';
}

function calcTime(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    return new Date(utc + (3600000 * offset));
}

$(function(){
    window.setInterval(function(){
        clock();
    }, 1000);
});

//UI open post
var post_opened = false;
window.openpost = function(post_index){
    $.ajax({
        type: "GET",
        url: "/api/items/p/" + post_index,
        contentType: "application/json",
        success: function(post){

            window.postimg.src = post.content.picture;
            window.posttext.innerHTML = post.content.about;

            $('.post').slideDown('slow', function(){
                post_opened = true;
            });
            //alert("message id: " + post_index+ "; post" + post.content.about);
        }
    });

};
$('#closepost').click(function(){
    $('.post').slideUp('slow', function(){
        post_opened = false;
    });
});
// escape pressed
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (!post_opened)
        return;
    if (evt.keyCode == 27) {
        $('.post').slideUp('slow', function(){
            post_opened = false;
        });
    }
};


// scroll banner magnet function
// resize window fix
$(window).bind('scroll resize', function(){
    if ( (($(window).height() + $(window).scrollTop())/$(document).height())*100 > 93 )
        $('.sponsor-row').css({
            position: 'fixed',
            top: '90%'
        });
    else
        $('.sponsor-row').css({
            position: 'absolute',
            top: $(document).height() - $(window).height()*0.25
        });
});

//playlist animate row

//$(window).load(function(){
//    var playerTracks = $('.playlist-item');
//    for (var i = 0; i < playerTracks.length; i++) {
//        if (playerTracks[i].offsetWidth < playerTracks[i].scrollWidth)
//            $(playerTracks[i]).liMarquee(
//                {
//                    circular: false
//                }
//            );
//    }
//   });