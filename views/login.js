$(document).ready(function(){
  var username,password;
  var performLogInRequest;

  $("#logInForm").click(function(){
    performLogInRequest = true;
    username = $("#username").val();
    if(!username){
      $("#logInAlertText").text("One of the fields have been left empty.Please submit only after completion.");
      $("#logInAlert").show();
      $("#username").parent().addClass('has-error');
      performLogInRequest = false;
    }else{
      $("#username").parent().removeClass('has-error');
    }
    password = $("#password").val();
    if(!password){
      $("#logInAlertText").text("One of the fields have been left empty.Please submit only after completion.");
      $("#logInAlert").show();
      $("#password").parent().addClass('has-error');
      performLogInRequest = false;
    }else{
      $("#password").parent().removeClass('has-error');
    }
    //perform an ajax request and
    if(performLogInRequest){
      $("#logInAlert").hide();
      $.ajax({
        //take care of this url and set it to a proper value
        url:"http://localhost:3000/verifyLogin",
        method:"POST",
        data:{
          username:username,
          password:password
        },
        success:function(responseJSON){
          console.log(responseJSON);
          var response = JSON.parse(responseJSON);
          if(response.status == "success"){
              window.location.href = 'http://localhost:3000/index.html'
          }else if(response.status == "error"){
              $("#logInAlertText").text(response.value);
              $("#logInAlert").show();
          }
        }
      })
    }
  });

});
