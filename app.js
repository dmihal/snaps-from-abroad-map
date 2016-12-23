var express = require('express');
var api = require('./api');
var app = express();

var oneDay = 86400000;

app.use(express.static(__dirname + '/static', { maxAge: oneDay }));
app.use('/api', api);

app.listen(process.env.PORT || 8000);

