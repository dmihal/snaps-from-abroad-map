var express = require('express');
var config = require('./config');
var https = require('https');

var router = express.Router();

var getFBPosts = function(callback) {
  var url = 'https://graph.facebook.com/v2.8/snapsfromabroad?&fields=posts.limit(100)%7Bplace%2Cattachments%7D&format=json&access_token=' + config.fbAppId + '|' + config.fbAppSecret;
  https.get(url, function(res) {
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
};

router.get('/posts', function(req, res) {
  getFBPosts(function(data){
    res.set('Content-Type', 'application/json');
    res.json(data);
  });
});

module.exports = router;
