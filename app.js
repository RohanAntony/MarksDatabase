var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.use(session({secret:'//Changed for security purposes'}));
var sess = "sBkROBqVxbdWhcX3QKGjLP5Z3jRQE5pAwDQObAWzq1SL7AdnkYZmTeiuQXfgsJ61bu0m5FDD8k9RwU6xykESrBG26HLxoBvxOX7kKE9sGbzSNJBhecTJZ710xgmatgRybw5HaCV074UzY1RlKAs5rI8JwzbrozUTIJ1gc6OEhkUeiCdDqhksrwULi9gBTld76ns2rtb6";

var studentDetails = require('./routes/studentDetails');
var branchDetails = require('./routes/branchDetails');
var subjectDetails = require('./routes/subjectDetails');
var studentMarks = require('./routes/studentMarks');
var updateMarks = require('./routes/updateMarks');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views',express.static(path.join(__dirname, 'views')));

app.use('/studentDetails',studentDetails);
app.use('/branchDetails',branchDetails);
app.use('/subjectDetails',subjectDetails);
app.use('/studentMarks',studentMarks);
app.use('/updateMarks',updateMarks);

app.post('/verifyLogin',function(req,res){
  if(req.body.username=='examsection' && req.body.password=='exam208'){
    req.sess=sess;
    res.redirect('/*');
  }else {
    req.sess=false;
    res.send("Authentication failed!!!");
  }
})

app.post('/logout',function(req,res){
  req.sess=false;
  res.redirect('/login.html');
})

app.post('/login.html',function(req,res){
  req.sess=false;
  res.sendFile(__dirname+'/views/login.html');
})

app.use('/*',function(req,res){
  if(req.sess==sess){
    res.sendFile(__dirname+'/views/index.html');
  }else{
    res.redirect('/login.html')
  }
});


module.exports = app;
