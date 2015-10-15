//player volume slider [mouse click]
$("#slider").slider({
    value  : 50,
    step   : 5,
    range  : 'min',
    animate: true,
    min    : 0,
    max    : 100,
    change : function(){
        var value = $("#slider").slider("value");
        document.getElementById("player").volume = (value / 100);
    },
    slide: function() {
        var value = $("#slider").slider("value");
        document.getElementById("player").volume = (value / 100);
    }
});

//player volume slider [mouse wheel]
$(".volume").on('mousewheel DOMMouseScroll', function(e) {
    var o = e.originalEvent;
    var delta = o && (o.wheelDelta || (o.detail && -o.detail));

    if ( delta ) {
        e.preventDefault();

        var step = $("#slider").slider("option", "step");
        step *= delta < 0 ? 1 : -1;
        $("#slider").slider("value", $("#slider").slider("value") + step);
    }
});

//now playing animate row
$('.now-play').liMarquee();

//player controls



// PLAYER FUNCTIONALITY

var url = 'http://central-srv.p-s.org.ua:15002';
var mountpoint = '/stream';

$(function(){

    $('#player_status').click(function(){
        if (Player.status)
            Player.pause();
        else
            Player.play();
    });

    console.log('exec player initialization');

    var Player = {
        status: null,
        p: document.getElementById('player'),
        btn: {
            play : document.getElementById('play'),
            pause : document.getElementById('pause')
        },
        init: function(){
            var $p = this.p;
            console.log('Player loaded', $p);
            var stat = document.getElementById('player_status');

            stat.innerText = 'loading';
            this.btn.play.onclick = function(){
                $p.play();
            };
            this.btn.pause.onclick = function(){
                $p.pause();
            }
            $p.addEventListener('loadeddata',function(){
                stat.innerText = 'pause';
                this.status = false;
                $("#pause").addClass('active').removeClass('pause');
                $("#play").addClass('active').removeClass('pause');
            });
            $p.addEventListener('play',function(){
                stat.innerText = 'play';
                this.status = true;
                $("#play").removeClass('active').addClass('pause');
                $("#pause").removeClass('active').addClass('pause');
            });
            $p.addEventListener('pause', function(){
                stat.innerText = 'pause';
                this.status = false;
                $("#pause").addClass('active').removeClass('pause');
                $("#play").addClass('active').removeClass('pause');
            });
        },
        status_update: function(){
            $.ajax({  type: 'GET',
                url: url+'/json.xsl',
                async: true,
                jsonpCallback: 'parseMusic',
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (json) {
                    // this is the element we're updating that will hold the track title
                    try{
                    if (json[mountpoint].title)
                        $('#track-title').text(''+json[mountpoint].title);
                    } catch(e){}
                },
                error: function (e) {console.log(e.message);
                }
            });
            setTimeout(function(){
                console.log('Updating status');
                Player.status_update();
            },10000)
        }
    };

    Player.init();
    Player.status_update();
});

