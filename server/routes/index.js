var express = require('express');
var router = express.Router();
var meta = require('../../service/meta');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'kytoneradio',
    timenow: meta.timenow()
    
  });
});

/* ng-include redirect */

router.get('/views/*', function(req, res, next) {
  res.render('../source/views/' + req.params[0]);
});

module.exports = router;
