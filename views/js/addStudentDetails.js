app.controller('addStudentDetails',function($scope,$http){


  $scope.searchRecord = function(){
    console.log($scope.usn);
    if($scope.usn){
      $http.post('/studentDetails/getDetails',{
        usn:$scope.usn.toUpperCase()
      }).then(function(response){
        console.log("Response:",response);
        if(response.data){
          $scope.name = response.data.name;
          $scope.usn = response.data.usn;
          $scope.alertText = "Record Found";
        }else{
          $scope.name = $scope.usn = "";
          $scope.alertText = "No Record was found";
        }
      },function(error){
        console.log("Error:",error);
        $scope.alertText = "Error in Angular JS sending data!!";
      })
    }else{
      $scope.alertText = "Enter a valid USN value!";
    }
  }

  $scope.submit = function(){
    console.log($scope.usn,$scope.name);
    if($scope.usn && $scope.name){
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
    }else{
      $scope.alertText = "Enter a valid values to USN and Name";
    }
  }
})
