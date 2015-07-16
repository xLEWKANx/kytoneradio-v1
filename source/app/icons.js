// Top icons animation

$('.soc-icon').hover(function(event) {
   $(this).addClass('animated flipInX');
   $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated flipInX');
    });
});


