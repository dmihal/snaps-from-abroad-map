var express = require('express');
require('dotenv').config();

var api = require('./api');
var app = express();

var oneDay = 86400000;

app.post("/", function(req, res, next) {
  req.method = "GET";
  next();
});
app.use(express.static(__dirname + '/static', { maxAge: oneDay }));
app.use('/api', api);

app.listen(process.env.PORT || 8000);

