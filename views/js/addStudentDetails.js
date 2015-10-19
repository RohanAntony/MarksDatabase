app.controller('addStudentDetails',function($scope){
  $scope.usn = "1DS13CS083";
  $scope.name = "ROHAN ANTONY";
  $scope.submit = function(){
    console.log($scope.usn,$scope.name);
  }
})
