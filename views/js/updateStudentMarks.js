app.controller('updateStudentMarks',function($scope,$http){

  $scope.attempts = [{name:'First',val:0},{name:'Second',val:1},{name:'Third',val:2},{name:'Fourth',val:3},{name:'Fifth',val:4}];
  $scope.types = [{name:'Val',val:'val'},{name:'Reval',val:'reval'}];
  $scope.student = {};
  $scope.student.marks = [];

  $http.post('/subjectDetails/getBranchDetails',{}).then(function(success){
    $scope.branches = success.data;
    $scope.branch = success.data[0];
  },function(error){
    $scope.alertText = "Error in getting GROUP subjects @ angularJS";
  });

  // Load the scheme and the semesters and the year with respect to the branch
  $scope.$watch('branch',function(newValue,oldValue){
    console.log(newValue);
    console.log($scope.branches.indexOf(newValue));
    $scope.yearList = newValue.scheme;
    $scope.year = newValue.scheme[0];
    $scope.semList = newValue.semesters;
    $scope.sem = newValue.semesters[0];
  })

  $scope.searchUserData = function(){
    $http.post('/updateMarks/getDetails',{
      usn:$scope.student.usn.toUpperCase(),
      branch:$scope.branch.name,
      group:$scope.branch.group,
      scheme:$scope.year,
      semester:$scope.sem
    }).then(function(response){
      console.log("Response:",response);
      if(response.data){
        console.log(response.data);
        $scope.student.name = response.data.name;
        $scope.student.usn = response.data.usn;
        $scope.student = response.data;
        $scope.alertText = "Record Found";
      }else{
        $scope.student.name = $scope.student.usn = "";
        $scope.alertText = "No Record was found";
      }
    },function(error){
      console.log("Error:",error);
      $scope.alertText = "Error in Angular JS sending data!!";
    })
  }

  function checkMinimum(index){
    console.log("checkMinimum/scope.student.marks[index]:",$scope.student.marks[index]);
    if($scope.student.marks[index].external[$scope.student.marks[index].element][$scope.student.marks[index].val] > $scope.student.marks[index].maxEA){
      $scope.alertText = "Externals marks exceeded value "+$scope.student.marks[index].maxEA;
      $scope.student.marks[index].external[$scope.student.marks[index].element][$scope.student.marks[index].val] = 0;
    }
    return true;
  }

  function newTotal(index){
    $scope.student.marks[index].total = 0;
    var maxValue = 0;
    $scope.student.marks[index].external.forEach(function(subject){
      // if(Number(subject[$scope.student.marks[index].val])+Number($scope.student.marks[index].internal) > $scope.student.marks[index].total)
      //   $scope.student.marks[index].total = Number(subject[$scope.student.marks[index].val])+Number($scope.student.marks[index].internal);
      if(Number(subject.val) > maxValue)
        maxValue = Number(subject.val);
      if(Number(subject.reval) > maxValue)
        maxValue = Number(subject.reval);
    })
    $scope.student.marks[index].total = Number($scope.student.marks[index].internal) + maxValue;
  }

  function calcPercentage(index){
    var percentage = 0;
    var fail = false;
    $scope.student.marks.forEach(function(subject){
      if(subject.per)
        percentage = parseInt(subject.total) + parseInt(percentage);
      if(subject.status == "Fail"){
        fail = true;
      }
    })
    $scope.student.percentage = Number((percentage/(parseInt($scope.student.totalMarks))*100));
    console.log(percentage,$scope.student.totalMarks,$scope.student.percentage);
    if(fail){
      $scope.student.class = "Fail";
    }else{
      if($scope.student.percentage > 70)
        $scope.student.class = "First Class with Distinction";
      else if($scope.student.percentage > 60)
        $scope.student.class = "First Class";
      else if($scope.student.percentage > 35)
        $scope.student.class = "Second Class";
      else
        $scope.student.class = "Fail";
    }
  }

  $scope.setAbsent = function(index){
    if(checkMinimum(index)){
      $scope.student.marks[index].external[$scope.student.marks[index].element].val = 0;
      $scope.student.marks[index].external[$scope.student.marks[index].element].reval = 0;
      $scope.student.marks[index].status = "Fail";
      $scope.student.marks[index].total = parseInt($scope.student.marks[index].internal) + parseInt($scope.student.marks[index].external[0].val);
      newTotal(index);
      calcPercentage(index);
    }
  }

  $scope.findTotal = function(index){
    if(checkMinimum(index)){
      newTotal(index);
          if(parseInt($scope.student.marks[index].total) >= parseInt($scope.student.marks[index].minTot)){
              $scope.student.marks[index].status = "Pass";
          }else {
              $scope.student.marks[index].status = "Fail";
              $scope.student.class="Fail";
          }
      calcPercentage(index);
    }
  }

  // $scope.findTotal = function(index){
  //   if(checkMinimum(index)){
  //     newTotal(index);
  //     $scope.student.marks[index].total = parseInt($scope.student.marks[index].internal) + parseInt($scope.student.marks[index].external[0].val);
  //     if(parseInt($scope.student.marks[index].internal) >= parseInt($scope.student.marks[index].minIA) && parseInt($scope.student.marks[index].external[0].val) >= parseInt($scope.student.marks[index].minEA) && parseInt($scope.student.marks[index].total) >= parseInt($scope.student.marks[index].minTot)){
  //         $scope.student.marks[index].status = "Pass";
  //     }else {
  //         $scope.student.marks[index].status = "Fail";
  //         $scope.student.class="Fail";
  //     }
  //     calcPercentage(index);
  //   }
  // }

  $scope.updateMarks = function(){
    var student = {};
    student.name = $scope.student.name;
    student.usn = $scope.student.usn;
    student.branch = $scope.branch.name;
    student.group = $scope.branch.group;
    student.scheme = $scope.year;
    student.semester = $scope.sem;
    student.marks = $scope.student.marks;
    student.percentage = $scope.student.percentage;
    student.class = $scope.student.class;
    student.subjectID = $scope.student.subjectID;
    console.log(student);
    $http.post('/updateMarks/addMarks',student).then(function(success){
      $scope.alertText = "Successfully added marks to the database";
      $scope.student.marks.forEach(function(subject,index){
        $scope.student.marks[index].internal = 0;
        $scope.student.marks[index].external.forEach(function(subject){
          subject = {
            val:0,
            reval:0,
            absent:false
          };
        });
        $scope.student.marks[index].element = 0;
        $scope.student.marks[index].val = "val";
        $scope.student.marks[index].total = 0;
        $scope.student.marks[index].status = "";
      })
      $scope.student.percentage = 0;
      $scope.student.class = "Fail";
      $scope.student.usn = "";
      $scope.student.name = "";
    },function(error){
      $scope.alertText = "Error in adding marks to the database";
    });
  }

})


//
//
//



//   //calculate the new percentage based on this if this is part of percentage
//
//
