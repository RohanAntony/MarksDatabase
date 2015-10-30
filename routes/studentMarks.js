var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var database = "marksDatabase";
var collections = ["marks"];
var db = mongojs(database,collections);

router.post('/addMarks',function(req,res){
  var JSONObject = req.body;
  JSONObject._id = req.body.subjectID+req.body.usn;
  db.marks.save(JSONObject,function(err,saved){
    if(err){
      res.send("Error in saving data to the database!");
      console.log("studentMarks/addMarks:Error is saving data to database");
    }else{
      res.send("Successfully wrote data to the database!");
      console.log("studentMarks/addMarks:Successfully saved data to database");
    }
  })
})

module.exports = router;
