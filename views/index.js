var app = angular.module('marksDatabase',['ngRoute']);

app.config(function($routeProvider,$locationProvider){

  $routeProvider
  .when('/addStudentDetails',{
    templateUrl:'/views/html/addStudentDetails.html',
    controller:'addStudentDetails'
  })
  .when('/addBranchDetails',{
    templateUrl:'/views/html/addBranchDetails.html',
    controller:'addBranchDetails'
  })
  .when('/addSubjectDetails',{
    templateUrl:'/views/html/addSubjectDetails.html',
    controller:'addSubjectDetails'
  })
  .when('/addStudentMarks',{
    templateUrl:'/views/html/addStudentMarks.html',
    controller:'addStudentMarks'
  })
  .when('/updateStudentMarks',{
    templateUrl:'/views/html/updateStudentMarks.html',
    controller:'updateStudentMarks'
  })
  
  $locationProvider.html5Mode(true);
})
