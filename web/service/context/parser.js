var fs = require('fs');
var q = require('q');

module.exports = function(data,callback){

  parseConfig(data,function(parsed){
    callback(parsed);
  })


}

function parseConfig(data,cb) {
    var callback = cb || function(){};

    var config_lines_arr = data.match(/(\w+)\ +(\w+)/g);
    
    var config_obj = {
        instance: {}
    };

    config_obj.addzip = function(arr,value){
        this.instance = merge_options(this.instance, ziparray(arr,value || null));
    }

    for(var i in config_lines_arr){
        var cfg = config_lines_arr[i];

        cfg = cfg.split(/\ +/);
        config_obj[ cfg[0] ] = cfg[1];

        var splited_cfg = cfg[0].split(/\_/g);
        // 'slider', '1', 'enable'
        config_obj.addzip(splited_cfg,cfg[1]);


    }

    callback(
        config_obj.instance
    );
}

// -----------------
// PRIVATE FUNCTIONS

function ziparray(arr,value){
    var zipname = {};
    
    if (arr.length == 1)
        zipname[arr[0]] = value || null;
     else
        zipname[arr[0]] = ziparray(arr.splice(1), value || null);
    
    return zipname
}

function merge_options(obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = merge_options(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}