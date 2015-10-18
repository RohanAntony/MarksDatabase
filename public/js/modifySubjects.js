$(document).ready(function(){

  var numberOfSubjects;

  var loadDefaultSubjects = function(){
      numberOfSubjects = $("#numberOfSubjects").val();
      $("#subjects").empty();
      for(var i=0;i<numberOfSubjects;i++)
        //$("#subjects").append("<div class='form-group subjectContent' data-value='"+i+"'><input style='float:left;width:40%;' class='form-control subjectContentCode' id='s"+(i+1)+"Code' placeholder='subject "+(i+1)+" code' type='text'><input style='float:left;width:57%;' class='form-control subjectContentName' id='s"+(i+1)+"Name' placeholder='subject "+(i+1)+" name' type='text'><div class='checkbox' style='float:left;width:1%;margin-left:1%;'><label><input type='checkbox' id='s"+(i+1)+"Lab' class='.subjectContentLab' ></label></div></div>");
        $("#subjects").append("<div class='form-group subjectContent' data-value='"+i+"'><input style='float:left;width:12%;' class='form-control subjectContentCode' id='s"+(i+1)+"Code' placeholder='subject "+(i+1)+" code' type='text'><input style='float:left;width:28%;' class='form-control subjectContentName' id='s"+(i+1)+"Name' placeholder='subject "+(i+1)+" name' type='text'><input style='float:left;width:10%;' class='form-control subjectContentMinInt' value='0' id='s"+(i+1)+"MinInt' placeholder='subject "+(i+1)+" MinInt' type='text'><input style='float:left;width:10%;' class='form-control subjectContentMinExt' value='35' id='s"+(i+1)+"MinExt' placeholder='subject "+(i+1)+" MinExt' type='text'><input style='float:left;width:10%;' class='form-control subjectContentMinTotal' value='50' id='s"+(i+1)+"MinTotal' placeholder='subject "+(i+1)+" MinTotal' type='text'><input style='float:left;width:10%;' class='form-control subjectContentMaxInt id='s"+(i+1)+"MaxInt placeholder='subject "+(i+1)+" MaxInt' value='25' type='text'><input style='float:left;width:10%;' class='form-control subjectContentMaxExt' value='100' id='s"+(i+1)+"MaxExt' placeholder='subject "+(i+1)+" MaxExt' type='text'><input style='float:left;width:10%;' class='form-control subjectContentMaxTotal' value='125' id='s"+(i+1)+"MaxTotal' placeholder='subject "+(i+1)+" MaxTotal' type='text'></div>");
  }
  loadDefaultSubjects();

  $("#numberOfSubjects").on("propertychange change paste input",function(){
      loadDefaultSubjects();
      //load the subjects values by getting content from server dynamically
  });


  $("#submitNewSubjects").click(function(){
      var ret = confirm("Do you want to modify the database");
      if(ret == true){
          var branchValue = $("#branch").val();
          var semesterValue = $("#semester").val();
          var schemeValue = $("#scheme").val();
          var subjectsValue = [{}];
          $(".subjectContent").each(function(){
              var subjectK = {};
              subjectK.code = $(this).find('.subjectContentCode').val();
              subjectK.name = $(this).find('.subjectContentName').val();
              subjectK.minimumInternals = Number($(this).find('.subjectContentMinInt').val());
              subjectK.maximumInternals = Number($(this).find('.subjectContentMaxInt').val());
              subjectK.minimumExternals = Number($(this).find('.subjectContentMinExt').val());
              subjectK.maximumExternals = Number($(this).find('.subjectContentMaxExt').val());
              subjectK.minimumTotal = Number($(this).find('.subjectContentMinTotal').val());
              subjectK.maximumTotal = Number($(this).find('.subjectContentMaxTotal').val());
              subjectsValue.push(subjectK);
          });
          var dataToSend = {
              branch:branchValue,
              semester:semesterValue,
              scheme:schemeValue,
              s:subjectsValue
          };
          dataToSend.sLength = subjectsValue.length;
          $.ajax({
            url:'http://vonturing.in:8080/modifySubjects',
            type:'POST',
            data:dataToSend,
            success:function(data){
                // alert(dataToSend);
                console.log(dataToSend);
                $("#modifySubjectsAlertText").text(data);
                $("#modifySubjectsAlert").show();
                $(".subjectContent").each(function(){
                    $(this).find('.subjectContentCode').val('');
                    $(this).find('.subjectContentName').val('');
                });
            }
          });
      }
      else if(ret == false){
            alert("No changes were made!!!");
      }
  });

  $("#modifySubjectsAlertClose").click(function(){
    $("#modifySubjectsAlert").hide();
  });

});
