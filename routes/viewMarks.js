var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var database = "marksDatabase";
var collections = ["marks"];
var db = mongojs(database,collections);

router.post('/getMarks',function(req,res){
  db.marks.find(req.body,function(err,found){
    if(err){
      res.send({data:'error in finding data!!'});
      console.log("updateMarks/getDetails:Error is saving data to database");
    }else{
      console.log(found);
      res.send(found);
      console.log("updateMarks/getDetails:Successfully found data from database",found[0]);
    }
  })
})

module.exports = router;
