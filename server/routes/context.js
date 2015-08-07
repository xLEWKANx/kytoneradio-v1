var express = require('express');
var router = express.Router();

var $ctx = require('../../service/context');

router.get('/app/context.js', function(req, res, next) {

    res.send( 'var $ctx = ' +
      JSON.stringify($ctx.get() || null)
    )

});

module.exports = router;
