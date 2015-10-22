var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var database = "marksDatabase";
var collections = ["branch","subjects"];
var db = mongojs(database,collections);

router.post('/getBranchDetails',function(req,res){
  db.branch.find({},function(err,found){
    if(err){
      console.log(err,"Error in accessing mongodb");
      res.send("");
    }else{
      console.log(found,"sending these data!!!");
      res.send(found);
    }
  })
})

router.post('/submitSubjects',function(req,res){
  var JSONObject = req.body;
  JSONObject._id = "DSCE_"+req.body.branch+req.body.group+req.body.scheme+req.body.semester;
  console.log(JSONObject);
  db.subjects.save(JSONObject,function(err,success){
    if(err){
      res.send("Error in saving to database!!");
    }else{
      res.send("Successfully saved a record to database!! with id "+success._id);
    }
  })
})

module.exports = router;
