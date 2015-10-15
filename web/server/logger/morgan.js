var morgan = require('morgan');

var _format = ':id :method :url [:status] - :response-time ms' 
var _options = {}

morgan.token('id', function getId(req) {
  return req.ip
})

module.exports = morgan(_format,_options)