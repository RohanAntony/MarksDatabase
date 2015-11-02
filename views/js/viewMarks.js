app.controller('viewMarks',function($scope,$http){

  $scope.searchUser = function(){
    $http.post('/viewMarks/getMarks',{
      usn:$scope.usn.toUpperCase()
    }).then(function(success){
      console.log(success.data);
      $scope.name = success.data[0].name;
      $scope.details = success.data;  //store the details of the marks in $scope.details
    },function(error){
      $scope.alertText = "Error in getting GROUP subjects @ angularJS";
    });
  }

  $scope.showDetails = function(){
    $scope.detailRecord = $scope.details[$scope.recordDetails];
    console.log($scope.detailRecord);
    $scope.detailRecord.marks.forEach(function(subject,index){
      subject.external.forEach(function(subjectInner,indexInner){

      });
    });
    // console.log($scope.recordDetails);
  }

  $scope.returnWord = function(value){
    switch(value){
      case '0':
        return "First Attempt";
        break;
      case '1':
        return "Second Attempt";
        break;
      case '2':
        return "Third Attempt";
        break;
    }
  }

})
