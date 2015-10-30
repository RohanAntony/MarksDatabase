var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var database = "marksDatabase";
var collections = ["branch"];
var db = mongojs(database,collections);
var JSONObject = {};

router.post('/addBranch',function(req,res){
  JSONObject = req.body;
  JSONObject._id = "DSCE_"+req.body.group+req.body.name;
  console.log(JSONObject);
  db.branch.save(JSONObject,function(err,saved){
    if (err){
      console.log(err);
      res.send("Error in saving data to the database!!");
    }else{
      console.log(saved);
      res.send("Saved with ID ' "+saved._id+" '");
    }
  });
})

router.post('/getBranch',function(req,res){
  console.log(req.body);
  db.branch.find(req.body,function(err,found){
    if(err){
      console.log(err,"No records sent,  error is fetching data!!");
      res.send("");
    }else{
      console.log(found[0]);
      res.send(found[0]);
    }
  })
})

module.exports = router;
