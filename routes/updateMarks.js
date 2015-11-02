var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var database = "marksDatabase";
var collections = ["marks"];
var db = mongojs(database,collections);

router.post('/getDetails',function(req,res){
  var JSONObject = req.body;
  console.log('updateMarks/getDetails:',req.body);
  db.marks.find(JSONObject,function(err,found){
    if(err){
      res.send({data:'error in finding data!!'});
      console.log("updateMarks/getDetails:Error is saving data to database");
    }else{
      res.send(found[0]);
      console.log("updateMarks/getDetails:Successfully found data from database",found[0]);
    }
  })
})

router.post('/addMarks',function(req,res){
  var JSONObject = req.body;
  JSONObject._id = req.body.subjectID+req.body.usn;
  db.marks.save(JSONObject,function(err,saved){
    if(err){
      res.send("Error in saving data to the database!");
      console.log("updateMarks/addMarks:Error is saving data to database");
    }else{
      console.log(saved);
      res.send("Successfully wrote data to the database!");
      console.log("updateMarks/addMarks:Successfully saved data to database");
    }
  })
})

module.exports = router;
