app.controller('addStudentDetails',function($scope,$http){
  $scope.searchRecord = function(){
    console.log($scope.usn);
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
  }

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
    console.log($scope.dusn);
    $http.post('/studentDetails/deleteDetails',{
      usn:$scope.dusn.toUpperCase()
    }).then(function(response){
      console.log(response);
      if(response.data.ok == 1 && response.data.n == 1){
        $scope.alertText = "A record was dropped";
        $scope.name = $scope.usn = $scope.dusn = "";
      }else if(response.data.ok == 1 && response.data.n == 0){
        $scope.alertText = "No record found";
      }
    },function(error){
      console.log(error);
      $scope.alertText = error;
    })
  }
})
