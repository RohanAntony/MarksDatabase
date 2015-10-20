var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var database = "marksDatabase";
var collections = ["student"];
var db = mongojs(database,collections);

/* GET home page. */
router.post('/getDetails', function(req, res, next) {
  console.log(req.body.name,req.body.usn);
});

router.post('/addDetails', function(req, res, next) {
  console.log(req.body.name,req.body.usn);
  var JSONObject = req.body;
  JSONObject._id = "DSCE"+JSONObject.usn;
  db.student.save(JSONObject,function(err,saved){
    if(err || !saved){
      console.log(err);
      res.send("Error writing to db.DO NOT CONTINUE!!");
    }else{
      console.log(saved);
      res.send(saved._id+","+saved.usn+","+saved.name);
    }
  });
  console.log(JSONObject);

});

module.exports = router;
