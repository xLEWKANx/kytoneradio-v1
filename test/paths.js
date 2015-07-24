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
console.log($paths);