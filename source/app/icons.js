/**
 * Created by eagle on 12/23/14.
 */

//svg icons integration

var playSvg = document.querySelectorAll('img.play');
var logoSvg = document.querySelectorAll('img.logo');
var kytoneSvg = document.querySelectorAll('img.kytone');
// Options
var buttonsOptions = {
    evalScripts: 'once',
    pngFallback: 'assets/png',
    each: function (svg) {
        svg.setAttribute('height', '1.5em');
        svg.setAttribute('width', '1.5em');
        svg.setAttribute('viewBox', '0 0 30 41');
        console.log('SVG injected: ' + svg.getAttribute('src'));
    }
}

var logoOptions = {
    evalScripts: 'once',
    pngFallback: 'assets/png',
    each: function (svg) {
        svg.setAttribute('height', '10em');
        svg.setAttribute('width', '10em');
        svg.setAttribute('viewBox', '110 0 100 100');
        console.log('SVG injected: ' + svg.getAttribute('src'));
    }
}

var kytoneOptions = {
    evalScripts: 'once',
    pngFallback: 'assets/png',
    each: function (svg) {
        svg.setAttribute('height', '10em');
        svg.setAttribute('width', '10em');
        svg.setAttribute('viewBox', '0 0 245 20');
        console.log('SVG injected: ' + svg.getAttribute('src'));
    }
}

// Trigger the injection
SVGInjector(playSvg, buttonsOptions, function (totalSVGsInjected) {
    // Callback after all SVGs are injected
    console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
});
SVGInjector(logoSvg, logoOptions, function (totalSVGsInjected) {
    // Callback after all SVGs are injected
    console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
});
SVGInjector(kytoneSvg, kytoneOptions, function (totalSVGsInjected) {
    // Callback after all SVGs are injected
    console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
});

// Top icons animation

$('.soc-icon').hover(function(event) {
   $(this).addClass('animated flipInX');
   $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated flipInX');
    });
});


