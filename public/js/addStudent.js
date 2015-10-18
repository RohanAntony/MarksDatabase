$(document).ready(function(){
  $("#newStudentData").click(function(){
    var dataToSend = {};
    dataToSend.usn = $('#usnNewStudent').val();
    dataToSend.name = $('#nameNewStudent').val();
    $.ajax({
      url:'http://vonturing.in:8080/addStudent',
      type:'POST',
      data:dataToSend,
      success:function(data){
//          alert(data);
          $("#addStudentsAlertText").text(data);
          $("#addStudentsAlert").show();
      },
      error:function(jqxhr,text,status){
        $("#addStudentsAlertText").text(text+":"+status);
        $("#addStudentsAlert").show();
      }
    });
  });

  $("#addStudentsAlertClose").click(function(){
    $("#addStudentsAlert").hide();
  });
});
