var express = require('express');
var config = require('./config');

var router = express.Router();

router.get('/posts', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

module.exports = router;
