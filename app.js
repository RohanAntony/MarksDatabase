var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var studentDetails = require('./routes/studentDetails');
var branchDetails = require('./routes/branchDetails');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views',express.static(path.join(__dirname, 'views')));

app.use('/studentDetails',studentDetails);
app.use('/branchDetails',branchDetails);

app.use('/*',function(req,res){
  res.sendFile(__dirname+'/views/index.html');
});

module.exports = app;
