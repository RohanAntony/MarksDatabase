var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user1',function(req,res){
  res.write('This is me!!');
})

module.exports = router;
