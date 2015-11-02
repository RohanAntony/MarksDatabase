app.controller('addStudentMarks',function($scope,$http){

  $scope.student = {};
  $scope.student.marks = [];
  $scope.student.subjects = [];

  function checkMinimum(index){
    if($scope.student.marks[index].internal > $scope.student.marks[index].maxIA){
      $scope.alertText = "Internals marks exceeded value "+$scope.student.marks[index].maxIA;
      $scope.student.marks[index].internal = 0;
    }else if($scope.student.marks[index].external[0].val > $scope.student.marks[index].maxEA){
      $scope.alertText = "Externals marks exceeded value "+$scope.student.marks[index].maxEA;
      $scope.student.marks[index].external[0].val = 0;
    }
    return true;
  }

  function calcPercentage(index){
    var percentage = 0;
    var fail = false;
    $scope.student.marks.forEach(function(subject,index){
      if(subject.per)
        percentage = parseInt(subject.total) + parseInt(percentage);
      if(subject.status == "Fail"){
        fail = true;
      }
    })
    $scope.student.percentage = Number((percentage/(parseInt($scope.student.totalMarks))*100));
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
      $scope.student.marks[index].external[0].val = 0;
      $scope.student.marks[index].total = parseInt($scope.student.marks[index].internal) + parseInt($scope.student.marks[index].external[0].val);
      $scope.student.marks[index].status = "Fail";
      calcPercentage(index);
    }
  }

  $scope.findTotal = function(index){
    if(checkMinimum(index)){
      $scope.student.marks[index].total = parseInt($scope.student.marks[index].internal) + parseInt($scope.student.marks[index].external[0].val);
      if(parseInt($scope.student.marks[index].internal) >= parseInt($scope.student.subjects[index].minIA) && parseInt($scope.student.marks[index].external[0].val) >= parseInt($scope.student.subjects[index].minEA) && parseInt($scope.student.marks[index].total) >= parseInt($scope.student.subjects[index].minTot)){
          $scope.student.marks[index].status = "Pass";
      }else {
          $scope.student.marks[index].status = "Fail";
      }
      calcPercentage(index);
    }
  }

  $scope.submitMarks = function(){
    var student = {};
    student.name = $scope.name;
    student.usn = $scope.usn;
    student.branch = $scope.branch.name;
    student.group = $scope.branch.group;
    student.scheme = $scope.year;
    student.semester = $scope.sem;
    student.marks = $scope.student.marks;
    student.marks.forEach(function(subject,index){
      for(var i=1;i<5;i++){
        student.marks[index].external[i] = {
          val:"",
          reval:"",
          absent:false
        };
      }
    })
    student.percentage = $scope.student.percentage;
    student.class = $scope.student.class;
    student.totalMarks = $scope.student.totalMarks;
    student.subjectID = $scope.student.subjectID;
    console.log('addStudentMarks/submitMarks/student:',student);
    $http.post('/studentMarks/addMarks',student).then(function(success){
      $scope.alertText = "Successfully added marks to the database";
      $scope.student.marks.forEach(function(subject,index){
        $scope.student.marks[index].internal = 0;
     // $scope.student.marks[index].external = [];
        $scope.student.marks[index].external[0] = {
          val:"",
          reval:"",
          absent:false
        };
        $scope.student.marks[index].total = 0;
        $scope.student.marks[index].status = "";
      })
      $scope.student.percentage = 0;
      $scope.student.class = "Fail";
      $scope.usn = "";
      $scope.name = "";
    },function(error){
      $scope.alertText = "Error in adding marks to the database";
    });
  }

  //Jump to start

  $http.post('/subjectDetails/getBranchDetails',{})
  .then(function(success){
    $scope.branches = success.data;
    $scope.branch = success.data[0];
  },function(error){
    $scope.alertText = "Error in getting GROUP subjects @ angularJS";
  });

  //Load the scheme and the semesters and the year with respect to the branch
  $scope.$watch('branch',function(newValue,oldValue){
    $scope.yearList = newValue.scheme;
    $scope.year = newValue.scheme[0];
    $scope.semList = newValue.semesters;
    $scope.sem = newValue.semesters[0];
  })

  $scope.searchSubjects = function(){
    $http.post('/subjectDetails/searchSubjects',{
      branch:$scope.branch.name,
      group:$scope.branch.group,
      scheme:$scope.year,
      semester:$scope.sem
    }).then(function(success){
      $scope.student.subjectID = success.data._id;
      $scope.student.subjects = success.data.subjects;
      $scope.student.percentage = 0;
      $scope.student.class = "Fail";
      $scope.student.marks = [];
      var totalMarks = 0;
      $scope.student.subjects.forEach(function(subject,index){
        $scope.student.marks[index] = {};
        $scope.student.marks[index].code = subject.code;
        $scope.student.marks[index].name = subject.name;
        $scope.student.marks[index].internal = 0;
        $scope.student.marks[index].external = [];
        $scope.student.marks[index].external[0] = {
          val:0,
          reval:"",
          absent:false
        };
        $scope.student.marks[index].total = 0;
        $scope.student.marks[index].minIA = subject.minIA;
        $scope.student.marks[index].maxIA = subject.maxIA;
        $scope.student.marks[index].minEA = subject.minEA;
        $scope.student.marks[index].maxEA = subject.maxEA;
        $scope.student.marks[index].minTot = subject.minTot;
        $scope.student.marks[index].maxTot = subject.maxTot;
        $scope.student.marks[index].status = "";
        $scope.student.marks[index].per = subject.per;
        if(subject.per)
          totalMarks += parseInt(subject.maxTot);
      })
      $scope.student.totalMarks = parseInt(totalMarks);
      console.log("addStudentMarks/forEach:",$scope.student.marks);
      $scope.alertText = "Data FOUND and LOADED.";
    },function(error){
      console.log(error);
    });
  }

  $scope.searchUser = function(){
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


})
