//context manager
//главная цель - хранить обьект контекст для доступа с клиентской стороны
var colors = require('colors');

var _ctx = {}

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