app.controller('addBranchDetails',function($scope,$http){

  $scope.group = "PG";

  $scope.searchRecord = function(){
    $http.post('/branchDetails/getBranch',{
      name:$scope.name,
      group:$scope.group
    }).then(function(success){
      if(success.data){
        console.log(success);
        $scope.group = success.data.group;
        $scope.yearList = success.data.scheme;
        $scope.semList = success.data.semesters;
        $scope.alertText = "Record was FOUND and is SHOWN";
      }else{
        console.log(success);
        $scope.alertText = "No record found";
        $scope.yearList = [2008,2009,2010,2011,2012,2013,2014,2015,2016];
        $scope.semList = [1,2,3,4,5,6,7,8,9];
      }
    },function(error){
      $scope.alertText = "Unable to search , Angular error!!";
    })
  }

  $scope.yearList = [2008,2009,2010,2011,2012,2013,2014,2015,2016];
  $scope.addYear = function(){
    if($scope.year){
      $scope.yearList.push(parseInt($scope.year));
      $scope.yearList.sort(function(a,b){return a-b;});
      $scope.year = "";
    }else{
      $scope.alertText = "Enter a valid year to add!!";
    }
  }
  $scope.removeYear = function(yearR){
    var i = $scope.yearList.indexOf(yearR);
    $scope.yearList.splice(i,1);
  }

  $scope.semList = [1,2,3,4,5,6,7,8,9];
  $scope.addSem = function(){
    if($scope.sem){
      $scope.semList.push(parseInt($scope.sem));
      $scope.semList.sort(function(a,b){return a-b;});
      $scope.sem = "";
    }else{
      $scope.alertText = "Enter a valid semester value to add";
    }
  }
  $scope.removeSem = function(semR){
    var i = $scope.semList.indexOf(semR);
    $scope.semList.splice(i,1);
  }

  $scope.submitBranch = function(){
    $http.post('/branchDetails/addBranch',{
      name:$scope.name,
      group:$scope.group,
      semesters:$scope.semList,
      scheme:$scope.yearList
    }).then(function(response){
      $scope.alertText = response.data;
    },function(error){
      $scope.alertText = "Error in sending data!! Angular Error!";
    });
  }

})
