var app = angular.module('marksDatabase',['ngRoute']);

app.config(function($routeProvider,$locationProvider){

  $routeProvider
  .when('/addStudentMarks',{
    templateUrl:'/views/html/addStudentMarks.html',
    controller:'addStudentMarks'
  })
  .when('/updateStudentMarks',{
    templateUrl:'/views/html/updateStudentMarks.html'
  })
  .when('/addStudentDetails',{
    templateUrl:'/views/html/addStudentDetails.html',
    controller:'addStudentDetails'
  })
  .when('/addSubjectDetails',{
    templateUrl:'/views/html/addSubjectDetails.html'
  })
  .when('/addOtherDetails',{
    templateUrl:'/views/html/addOtherDetails.html'
  })
  .when('/viewMarks',{
    templateUrl:'/views/html/viewMarks.html'
  })

  $locationProvider.html5Mode(true);
})
