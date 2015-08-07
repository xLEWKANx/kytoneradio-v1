var fs = require('fs'),
    path = require('path');

var file_cfg = {
  path: path.join(__dirname, '..', 'paths.json'),
  encoding: 'UTF-8'
};

var $paths = JSON.parse(
  fs.readFileSync(
    file_cfg.path, file_cfg.encoding));
// ---
 
function generatePaths(cfg){
  var genpaths = {};

  for(var k in cfg.paths){
    var p = cfg.paths[k];
    genpaths[p] = path.join(__dirname,cfg.source,p)
  }

  genpaths.out = path.join(__dirname, cfg.dest)

  return genpaths;
}

console.log(
  generatePaths($paths)
);