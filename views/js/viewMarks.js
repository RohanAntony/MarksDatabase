app.controller('viewMarks',function($scope,$http){

  $scope.searchUser = function(){
    $http.post('/viewMarks/getMarks',{
      usn:$scope.usn.toUpperCase()
    }).then(function(success){
      console.log(success.data);
      $scope.name = success.data[0].name;
      $scope.details = success.data;
    },function(error){
      $scope.alertText = "Error in getting GROUP subjects @ angularJS";
    });
  }

  $scope.showDetails = function(){
    $scope.detailRecord = $scope.details[$scope.recordDetails];
    console.log($scope.detailRecord);
    // console.log($scope.recordDetails);
  }

})
