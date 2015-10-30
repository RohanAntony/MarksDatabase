app.controller('addSubjectDetails',function($scope,$http){

    $scope.subjects = [{
      code:'',
      name:'',
      minIA:15,
      maxIA:25,
      minEA:35,
      maxEA:100,
      minTot:50,
      maxTot:125,
      per:true
    },{
      code:'',
      name:'',
      minIA:15,
      maxIA:25,
      minEA:35,
      maxEA:100,
      minTot:50,
      maxTot:125,
      per:true
    }];

    $http.post('/subjectDetails/getBranchDetails',{})
    .then(function(success){
      $scope.branches = success.data;
      $scope.branch = success.data[0];
      console.log($scope.branches);
    },function(error){
      $scope.alertText = "Error in getting GROUP subjects @ angularJS";
    });

    $scope.$watch('branch',function(newValue,oldValue){
      console.log(newValue);
      console.log($scope.branches.indexOf(newValue));
      $scope.yearList = newValue.scheme;
      $scope.year = newValue.scheme[0];
      $scope.semList = newValue.semesters;
      $scope.sem = newValue.semesters[0];
    })

    $scope.submit = function(){
      $http.post('/subjectDetails/submitSubjects',{
        branch:$scope.branch.name,
        group:$scope.branch.group,
        scheme:$scope.year,
        semester:$scope.sem,
        subjects:$scope.subjects
      }).then(function(success){
        $scope.alertText = success.data;
      },function(error){
        $scope.alertText = "Error:addSubjectDetails->$scope.submit()";
      });
    }

    $scope.search = function(){
      $http.post('/subjectDetails/searchSubjects',{
        branch:$scope.branch.name,
        group:$scope.branch.group,
        scheme:$scope.year,
        semester:$scope.sem
      }).then(function(success){
        $scope.subjects = success.data.subjects;
        if(!$scope.subjects){
          $scope.subjects = [{
            code:'',
            name:'',
            minIA:15,
            maxIA:25,
            minEA:35,
            maxEA:100,
            minTot:50,
            maxTot:125,
            per:true
          },{
            code:'',
            name:'',
            minIA:15,
            maxIA:25,
            minEA:35,
            maxEA:100,
            minTot:50,
            maxTot:125,
            per:true
          }];
          $scope.alertText = "Data was not found.Please enter these values";
        }else{
          $scope.alertText = "Data FOUND and LOADED.";
        }
      },function(error){
        console.log(error);
      });
    }

    $scope.deleteRow = function(index){
      $scope.subjects.splice(index,1);
    }

    $scope.addRow = function(){
      $scope.subjects.push({
        code:'',
        name:'',
        minIA:15,
        maxIA:25,
        minEA:35,
        maxEA:100,
        minTot:50,
        maxTot:125,
        per:true
      });
    }
})
