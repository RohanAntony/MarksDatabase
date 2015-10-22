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

  $locationProvider.html5Mode(true);
})
