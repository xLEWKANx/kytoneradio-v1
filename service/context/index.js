//context manager
//главная цель - хранить обьект контекст для доступа с клиентской стороны
var colors = require('colors');

var _ctx = {
  slidersCfg: [
    {
      outerIndex: 1,
      autoplay: true,
      speed: 300,
      wrapperClass: 'cover-wrapper',
      pauseOnHover: true,
      rtl: false,
      playerPlaceShow: true
    },
    {
      outerIndex: 2,
      autoplay: true,
      speed: 300,
      wrapperClass: 'cover-wrapper-big',
      pauseOnHover: true,
      rtl: false,
      playerPlaceShow: false
    },
    {
      outerIndex: 3,
      autoplay: true,
      speed: 300,
      wrapperClass: 'cover-wrapper',
      pauseOnHover: true,
      rtl: false,
      playerPlaceShow: true
    }
  ]
}

module.exports.get = function(){
  return _ctx
}

module.exports.load = function(name,promise){
  promise
    .then(success(name) )
    .fail(error(name) )
}

function success(name){
  return function(data){
    console.log('Context resolved with %s variable: %s',
      name.underline.yellow,
      data.green
    )
    _ctx[name] = data;

  }
}

function error(name){
  return function(err){
    console.log('Context rejected %s variable. Error: %s',
      name.underline.yellow,
      err.red
      )

  }
}
