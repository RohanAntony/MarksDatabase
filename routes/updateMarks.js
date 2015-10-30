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

module.exports = router;
