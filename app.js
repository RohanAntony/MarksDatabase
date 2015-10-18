var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongojs = require('mongojs');

var app = express();

var database = "collegeMarksDB";
var collections = ["marks","student","subjects","editors"];
var db = mongojs(database,collections);
var subjectsDB = db.subjects;
var studentDB = db.student;
var marksDB = db.marks;
var editorsDB = db.editors;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({secret:'//Changed for security purposes'}));

var sess;

app.get('/',function(req,res){
    sess = req.session;
    if(sess.username)
      res.sendfile(__dirname+'/public/index.html');
    else
      res.redirect('/login');
});

app.get('/login',function(req,res){
    res.sendfile(__dirname+'/public/login.html');
});

app.get('/css/*',function(req,res){
  res.sendfile(__dirname+'/public/css/'+path.basename(req.url));
});

app.get('/js/*',function(req,res){
  res.sendfile(__dirname+'/public/js/'+path.basename(req.url));
});

app.get('/img/*',function(req,res){
  res.sendfile(__dirname+'/public/img/'+path.basename(req.url));
})

app.post('/modifySubjects',function(req,res){
  var JSONObject = {};
  console.log('/modifySubjects');
  console.log(req.body);
  JSONObject.branch = req.body.branch;
  JSONObject.semester = req.body.semester;
  JSONObject.scheme = req.body.scheme;
  var subjects = [{}];
  for(var i=1;i<req.body.sLength;i++){
    subjects[i-1] = {};
    subjects[i-1].code = req.body['s['+i+'][code]'];
    subjects[i-1].name = req.body['s['+i+'][name]'];
    subjects[i-1].minimumInternals = req.body['s['+i+'][minimumInternals]'];
    subjects[i-1].maximumInternals = req.body['s['+i+'][maximumInternals]'];
    subjects[i-1].minimumExternals = req.body['s['+i+'][minimumExternals]'];
    subjects[i-1].maximumExternals = req.body['s['+i+'][maximumExternals]'];
    subjects[i-1].minimumTotal = req.body['s['+i+'][minimumTotal]'];
    subjects[i-1].maximumTotal = req.body['s['+i+'][maximumTotal]'];
  }
  JSONObject._id = "CMDB"+JSONObject.branch+JSONObject.semester+JSONObject.scheme+"DSCE";
  JSONObject.subjects = subjects;
  subjectsDB.save(JSONObject);
  console.log(JSONObject);
  res.write("("+JSONObject.branch+":"+JSONObject.semester+") subjects have been added to the database.");
  res.end();
});

app.post('/addStudent',function(req,res){
  JSONObject = req.body;
  JSONObject._id = "CMDB"+JSONObject.usn+"DSCE";
  studentDB.save(JSONObject);
  console.log(JSONObject);
  res.send("("+JSONObject.name+":"+JSONObject.usn+") has been added to the database.");
});

app.post('/getSubjects',function(req,res){
  console.log('/getSubjects');
  console.log(req.body);
  //use this function to post the subjects wrt to given sem and branch
  subjectsDB.find({branch:req.body.branch,semester:req.body.semester,scheme:req.body.scheme},function(err,subjectsFound){
    if(err){
      console.log(err);
      res.send('{}');
    }else{
      console.log(subjectsFound);
      res.send(subjectsFound);
    }
  })
});

app.post('/getName',function(req,res){
  console.log('/getName');
  console.log(req.body);
  //use this function to get the name of student provided the usn is provided
  studentDB.find({usn:req.body.usn},function(err,studentFound){
    var sendData = {};
    if(err){
      console.log(err);
      sendData = {
        status:"Error",
        value:err+""
      }
    }else if(studentFound[0]){
      console.log(studentFound);
      sendData = {
        status:"Success",
        value:studentFound[0].name
      };
    }else{
      sendData = {
        status:"Error",
        value:"No student with this USN was found!!!Please update the student database or enter a valid usn."
      }
    }
    res.send(sendData);
  })
});

app.post('/submitMarks',function(req,res){
  console.log('/submitMarks');
  var JSONObject = {};
  JSONObject.usn = req.body.usn;
  JSONObject.name = req.body.name;
  JSONObject.branch = req.body.branch;
  JSONObject.semester = req.body.semester;
  JSONObject.month = req.body.month;
  JSONObject.year = req.body.year;
  JSONObject.percentage = req.body.percentage;
  JSONObject.class = req.body.class;
  JSONObject.referenceId = req.body.referenceId;
  JSONObject.subjects = [{}];
  for(var i=0;i<req.body.sLength;i++){
    JSONObject.subjects[i] = {};
    JSONObject.subjects[i].code = req.body['subject['+i+'][code]'];
    JSONObject.subjects[i].name = req.body['subject['+i+'][name]'];
    JSONObject.subjects[i].external = req.body['subject['+i+'][external]'];
    JSONObject.subjects[i].internal = req.body['subject['+i+'][internal]'];
    JSONObject.subjects[i].total = req.body['subject['+i+'][total]'];
    JSONObject.subjects[i].status = req.body['subject['+i+'][status]'];
    JSONObject.subjects[i].attempt = [];
    JSONObject.subjects[i].attempt[0] = {};
    JSONObject.subjects[i].attempt[0].valuvation = req.body['subject['+i+'][attempt][0][valuvation]'];
    JSONObject.subjects[i].attempt[0].revaluvation = req.body['subject['+i+'][attempt][0][revaluvation]'];
    JSONObject.subjects[i].attempt[1] = {};
    JSONObject.subjects[i].attempt[1].valuvation = req.body['subject['+i+'][attempt][1][valuvation]'];
    JSONObject.subjects[i].attempt[1].revaluvation = req.body['subject['+i+'][attempt][1][revaluvation]'];
    JSONObject.subjects[i].attempt[2] = {};
    JSONObject.subjects[i].attempt[2].valuvation = req.body['subject['+i+'][attempt][2][valuvation]'];
    JSONObject.subjects[i].attempt[2].revaluvation = req.body['subject['+i+'][attempt][2][revaluvation]'];
  }
  JSONObject._id = "CMDB"+JSONObject.branch+JSONObject.semester+JSONObject.usn+"DSCE";
  marksDB.save(JSONObject,function(err,marksAdded){
      if(err){
        console.log(err);
        res.send('err');
      }
      else{
        console.log(marksAdded);
        res.send("("+marksAdded.usn+":"+marksAdded.branch+":"+marksAdded.semester+") marks has been added.");
      }
  });
});

app.post('/updateMarks',function(req,res){
  console.log('/updateMarks');
  console.log(req.body);
  console.log(req.body);
  var JSONObject = {};
  JSONObject.usn = req.body.usn;
  JSONObject.name = req.body.name;
  JSONObject.branch = req.body.branch;
  JSONObject.semester = req.body.semester;
  JSONObject.month = req.body.month;
  JSONObject.year = req.body.year;
  JSONObject.percentage = req.body.percentage;
  JSONObject.class = req.body.class;
  JSONObject.referenceId = req.body.referenceId;
  JSONObject.subjects = [{}];
  for(var i=0;i<req.body.sLength;i++){
    JSONObject.subjects[i] = {};
    JSONObject.subjects[i].code = req.body['subjects['+i+'][code]'];
    JSONObject.subjects[i].name = req.body['subjects['+i+'][name]'];
    JSONObject.subjects[i].external = req.body['subjects['+i+'][external]'];
    JSONObject.subjects[i].internal = req.body['subjects['+i+'][internal]'];
    JSONObject.subjects[i].total = req.body['subjects['+i+'][total]'];
    JSONObject.subjects[i].status = req.body['subjects['+i+'][status]'];
    JSONObject.subjects[i].attempt = [];
    JSONObject.subjects[i].attempt[0] = {};
    JSONObject.subjects[i].attempt[0].valuvation = req.body['subjects['+i+'][attempt][0][valuvation]'];
    JSONObject.subjects[i].attempt[0].revaluvation = req.body['subjects['+i+'][attempt][0][revaluvation]'];
    JSONObject.subjects[i].attempt[1] = {};
    JSONObject.subjects[i].attempt[1].valuvation = req.body['subjects['+i+'][attempt][1][valuvation]'];
    JSONObject.subjects[i].attempt[1].revaluvation = req.body['subjects['+i+'][attempt][1][revaluvation]'];
    JSONObject.subjects[i].attempt[2] = {};
    JSONObject.subjects[i].attempt[2].valuvation = req.body['subjects['+i+'][attempt][2][valuvation]'];
    JSONObject.subjects[i].attempt[2].revaluvation = req.body['subjects['+i+'][attempt][2][revaluvation]'];
  }
  JSONObject._id = "CMDB"+JSONObject.branch+JSONObject.semester+JSONObject.usn+"DSCE";
  marksDB.save(JSONObject,function(err,marksAdded){
      if(err){
        console.log(err);
        res.send('err');
      }
      else{
        console.log(marksAdded);
        res.send("("+marksAdded.usn+":"+marksAdded.branch+":"+marksAdded.semester+") marks has been updated.");
      }
  });
});

app.post('/getStudentMarks',function(req,res){
  console.log(req.body);
  var arrayJSONObject = [];
  var JSONObject = {};
  JSONObject.usn = req.body.usn;
  JSONObject.branch = req.body.branch;
  JSONObject.semester = req.body.semester;
  marksDB.find(JSONObject,function(err,marksFound){
    if(err){
      res.send(err);
      console.log(err);
      return;
    }else if(marksFound[0]){
      arrayJSONObject[0] = {};
      arrayJSONObject[0] = marksFound[0];
      subjectsDB.find({_id:marksFound[0].referenceId},function(err,subjectsFound){
          if(err){
            res.send(err);
            console.log(err);
            return;
          }else if(subjectsFound[0]){
            arrayJSONObject[1] = {};
            arrayJSONObject[1] = subjectsFound[0];
            res.send(arrayJSONObject);
            console.log(arrayJSONObject);
          }else{
            console.log('Subjects found was empty in /getStudentMarks!!');
            res.send('{}');
          }
      })
    }else{
      console.log('/getStudentMarks:marksFound returned empty!!');
      res.send('[]');
    }
  })
})


app.post('/checkLogin',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  editorsDB.findOne({"username":username},function(err,editor){
    if(editor){
      if(editor.password == password){
         sess.username = editor.username;
         req.session.username = editor.username;
         res.write(JSON.stringify({status:"success",value:"http://vonturing.in:8080"}));
         res.end();
      }else{
        res.write(JSON.stringify({status:"error",value:"Authentication Failed"}));
        res.end();
      }
    }else{
      res.write(JSON.stringify({status:"error",value:"Authentication Failed"}));
      res.end();
    }
  });
});

app.get('/logout',function(req,res){
  req.session.destroy(function(err){
    if(err)
      console.log(err);
    else
      res.redirect('/login');
  });
});

module.exports = app;
