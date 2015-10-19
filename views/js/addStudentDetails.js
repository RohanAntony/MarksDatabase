app.controller('addStudentDetails',function($scope,$http){


  $scope.submit = function(){
    console.log($scope.usn,$scope.name);
    $http.post('/studentDetails/addDetails',{
      name:$scope.name.toUpperCase(),
      usn:$scope.usn.toUpperCase()
    }).then(function(response){
      console.log(response);
      $scope.alertText = response.data;
      $scope.name = $scope.usn = "";
    },function(error){
      console.log(error);
      $scope.alertText = error;
    })
  }

  $scope.delete = function(){
    console.log($scope.id);
    $http.post('/studentDetails/deleteDetails',{
      id:$scope.id.toUpperCase()
    }).then(function(response){
      console.log(response);
      $scope.alertText = response.data;
      $scope.id = "";
    },function(error){
      console.log(error);
      $scope.alertText = error;
    })
  }
})
