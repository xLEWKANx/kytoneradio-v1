var express = require('express');
var router = express.Router();
var meta = require('../../service/meta');

var postersRoute = require('./posters');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'kytoneradio',
    timenow: meta.timenow()
    
  });
});

/* ng-include redirect */

router.use('/',postersRoute);

module.exports = router;
