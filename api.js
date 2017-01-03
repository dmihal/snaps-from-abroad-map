var express = require('express');
var config = require('./config');
var https = require('https');

var router = express.Router();

var getFBPosts = function(callback) {
  var url = 'https://graph.facebook.com/v2.8/snapsfromabroad?&fields=posts.limit(100)%7Bplace%2Cattachments%7D&format=json&access_token=' + config.fbAppId + '|' + config.fbAppSecret;
  var req = https.get(url, function(res) {
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function(chunk) {
      rawData += chunk
    });
    res.on('end', function() {
      try {
        var parsedData = JSON.parse(rawData);
        callback(parsedData);
      } catch (e) {
        console.log(e.message);
      }
    });
  });
  req.on('error', function() {
    callback();
  });
};

router.get('/posts', function(req, res) {
  getFBPosts(function(data){
    if (!data) {
      return res.status(500).end();
    }
    res.set('Content-Type', 'application/json');
    res.json(data.posts.data);
  });
});

module.exports = router;
