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

module.exports = router;
