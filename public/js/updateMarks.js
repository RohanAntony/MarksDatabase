$(document).ready(function(){

  var updateMarksData = {};
  var subjectsData = {};

  function loadMarks(){
    var data = {
      usn:$("#updateMarksUSN").val(),
      branch:$("#updateMarksBranch").val(),
      semester:$("#updateMarksSemester").val()//updateMarksSemester
    };
    $.ajax({
      type:'POST',
      data:data,
      url:'http://vonturing.in:8080/getStudentMarks',
      success:function(data){
          updateMarksData = data[0];
          subjectsData = data[1];
          console.log(data);
          console.log(updateMarksData,subjectsData);
          $("#updateMarksSubjects").empty();
          $(updateMarksData.subjects).each(function(index,value){
            var selectElementAttempt = '<select style="float:left;width:15%;" class="form-control attempt" id="attempt'+index+'" data-value='+index+'><option value="0">First Attempt</option><option value="1">Second Attempt</option><option value="2">Third Attempt</option></select>';
            var selectElementType = '<select style="float:left;width:15%;" class="form-control type" id="type'+index+'" data-value='+index+'><option value="valuvation" >Valuvation</option><option value="revaluvation">Revaluvation</option></select>';
            $("#updateMarksSubjects").append('<div style="clear:both;"><input class="form-control subjectCode" style="float:left;width:14%" type="text" value='+updateMarksData.subjects[index].code+' readonly><input class="form-control subjectNameUpdateMarks" style="float:left;width:28%;" type="text" value='+updateMarksData.subjects[index].name+' readonly>'+selectElementAttempt+selectElementType+'<input class="form-control subjectMarks" style="float:left;width:14%" id="marks'+index+'" value='+updateMarksData.subjects[index].attempt[0]['valuvation']+' data-value="'+index+'" type="text"><input class="form-control subjectExternals" style="float:left;width:14%" type="text" id="externalsUpdateMarks'+index+'" value='+updateMarksData.subjects[index].external+' readonly></div>');
          });
          $("#updateMarksPercentage").val(updateMarksData.percentage);
          $("#updateMarksClass").val(updateMarksData.class);
      },
      error:function(jqxhr,text,status){
          console.log(jqxhr,text,status);
      }
    });
  }

  $("#updateMarksSubjects").on('change','select.attempt',function(){
      //call a function to determine the change
      var val = $(this).data('value');
      var attempt = $("#attempt"+val).val();
      var type = $("#type"+val).val();
      $("#marks"+val).val(updateMarksData.subjects[val].attempt[attempt+""][type+""]);
      console.log(updateMarksData.subjects[val].attempt[attempt+""][type+""]);
  });

  $("#updateMarksSubjects").on('change','select.type',function(){
      //call a function to determine the change
      var val = $(this).data('value');
      var attempt = $("#attempt"+val).val();
      var type = $("#type"+val).val();
      $("#marks"+val).val(updateMarksData.subjects[val].attempt[attempt+""][type+""]);
      console.log(updateMarksData.subjects[val].attempt[attempt+""][type+""]);
  });

  $("#updateMarksSubjects").on('change','input.subjectMarks',function(){
      var val = $(this).data('value');
      var value = $(this).val();
      var attempt = $("#attempt"+val).val();
      var type = $("#type"+val).val();
      if(Number(value) > subjectsData.subjects[val].maximumExternals){
          $("#updateMarksAlertText").text("External marks cannot exceed "+subjectsData.subjects[val].maximumExternals);
          $("#updateMarksAlert").show();
          $(this).val('');
          return;
      }
      updateMarksData.subjects[val].attempt[attempt+""][type+""] = Number(value);
      console.log(updateMarksData.subjects[val].attempt[attempt+""][type+""],attempt+"",type+"");
      updateMarksData.subjects[val].external = getExternals(val);
      updateMarksData.subjects[val].total = Number(updateMarksData.subjects[val].internal) + Number(updateMarksData.subjects[val].external);
      $("#externalsUpdateMarks"+val).val(updateMarksData.subjects[val].external);
      updateMarksData.percentage = (getPercentage()).toFixed(2);
      $("#updateMarksPercentage").val(updateMarksData.percentage);
      updateMarksData.subjects[val].status = passFail(val,updateMarksData.subjects[val].total,updateMarksData.subjects[val].external);
      if(updateMarksData.percentage>=70)
        $("#updateMarksClass").val('FCD');
      else if(updateMarksData.percentage>=60)
        $("#updateMarksClass").val('FC');
      else if(updateMarksData.percentage>=35)
        $("#updateMarksClass").val('SC');
      else
        $("#updateMarksClass").val('F');
      updateMarksData.class = $("#updateMarksClass").val();
      return;
  })

  function passFail(val,total,externals){
    if(subjectsData.subjects[val].minimumExternals && subjectsData.subjects[val].minimumExternals > externals)
      return "Fail";
    else if(subjectsData.subjects[val].minimumTotal && subjectsData.subjects[val].minimumTotal > total)
      return "Fail";
    else
      return "Pass";
  }

  function getExternals(val){
      var maxValue = 0;
      $(updateMarksData.subjects[val].attempt).each(function(index,value){
          if(updateMarksData.subjects[val].attempt[index]['valuvation'] > maxValue)
            maxValue = updateMarksData.subjects[val].attempt[index]['valuvation'];
          if(updateMarksData.subjects[val].attempt[index]['revaluvation'] > maxValue)
            maxValue = updateMarksData.subjects[val].attempt[index]['revaluvation'];
      });
      return maxValue;
  }

  function getPercentage(){
    var percentage = 0,total = 0,maxTotal = 0;
    $(subjectsData.subjects).each(function(index,value){
        maxTotal+=Number(subjectsData.subjects[index].maximumTotal);
    });
    $(updateMarksData.subjects).each(function(index,value){
        total+=Number(updateMarksData.subjects[index].total);
    });
    percentage = (total/maxTotal)*100;
    console.log("Percentage:",total,maxTotal,percentage);
    return percentage;
  }

  $("#updateMarksBranch").change(function(){
      loadMarks();
  });

  $("#updateMarksSemester").change(function(){
      loadMarks();
  });

  $("#updateMarksUSN").change(function(){
      var dataToSend = {
        usn:$(this).val()
      };
      $.ajax({
        url:'http://vonturing.in:8080/getName',
        type:'POST',
        data:dataToSend,
        success:function(data){
          console.log(data);
          if(data.status == 'Success'){
            $("#updateMarksName").val(data.value);
            loadMarks();
          }else{
            $("#updateMarksUSN").val('');
            $("#updateMarksName").val('');
            alert(data.value);
          }
        }
      });
  });

  $("#updateStudentMarksSubmit").click(function(){
      updateMarksData.sLength = updateMarksData.subjects.length;
      $.ajax({
        url:'http://vonturing.in:8080/updateMarks',
        type:'POST',
        data:updateMarksData,
        success:function(data){
          console.log(updateMarksData);
          $("#updateMarksAlertText").text(data);
          $("#updateMarksAlert").show();
        },
        error:function(xhr,text,status){
          alert(text+":"+status);
        }
      });
  })


  $("#updateMarksAlertClose").click(function(){
    $("#updateMarksAlert").hide();
  });

});
