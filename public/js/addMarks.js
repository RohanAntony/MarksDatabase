$(document).ready(function(){

  loadSubjects();
  var subjects = {},data = {};

	function loadSubjects(){
      var dataToSend = {
        branch: $("#addMarksBranch").val(),
        semester: $("#addMarksSemester").val(),
        scheme: $("#addMarksScheme").val()
      };

      $.ajax({
        type: "POST",
        url: "http://vonturing.in:8080/getSubjects",   //change this url to a proper format
        data: dataToSend,
        success: function(data){
          $("#addMarksSubjects").empty();
          //load the dynamic subject generator with input type text and marks
          for(var i=0;i<data[0].subjects.length;i++){
            $("#addMarksSubjects").append('<div class="subjectMarks"><input type="text" class="form-control code" style="float:left;width:12%" value="'+data[0].subjects[i].code+'" readonly/><input type="text" class="form-control name" style="float:left;width:28%" value="'+data[0].subjects[i].name+'" readonly/><input type="text" class="form-control internals" id="internals'+i+'" data-value="'+i+'" style="float:left;width:17%"/><input type="text" class="form-control externals" id="externals'+i+'" data-value="'+i+'" style="float:left;width:17%"/><input type="text" class="form-control total" id="total'+i+'" data-value="'+i+'" style="float:left;width:17%" readonly/><input type="text" class="form-control status" id="status'+i+'" data-value="'+i+'" style="float:left;width:9%;" readonly/></div>');
            data[0].subjects[i].minimumInternals = Number(data[0].subjects[i].minimumInternals);
            data[0].subjects[i].maximumInternals = Number(data[0].subjects[i].maximumInternals);
            data[0].subjects[i].minimumExternals = Number(data[0].subjects[i].minimumExternals);
            data[0].subjects[i].maximumExternals = Number(data[0].subjects[i].maximumExternals);
            data[0].subjects[i].minimumTotal = Number(data[0].subjects[i].minimumTotal);
            data[0].subjects[i].maximumTotal = Number(data[0].subjects[i].maximumTotal);
          }
          subjects = data[0];
          console.log(subjects);
        },
        error: function(jqxhr,text,status){
          console.log(text,status);
        }
      });
	}


  $("#addMarksAlertClose").click(function(){
    $("#addMarksAlert").hide();
  });


  $("#addMarksBranch").change(function(){
      loadSubjects();
      //write a function that will also set the semester with respect to the branch
  });


  $("#addMarksSemester").change(function(){
      loadSubjects();
  });

  $("#addMarksScheme").change(function(){
      loadSubjects();
  })

  $("#addMarksUSN").change(function(){
      var dataToSend = {
        usn:$("#addMarksUSN").val()
      };
      $.ajax({
        url:'http://vonturing.in:8080/getName',
        type:'POST',
        data:dataToSend,
        success:function(data){
          console.log(data);
          if(data.status == 'Success'){
            $("#addMarksName").val(data.value);
          }else{
            $("#addMarksUSN").val('');
            $("#addMarksName").val('');
            alert(data.value);
          }
        }
      });
  });


  $("#addMarksSubjects").on('change','input.internals',function(){
      //call a function to determine the change
      var val = $(this).data('value');
      var internals = $("#internals"+val).val();
      var externals = $("#externals"+val).val();
      var total;
      if(internals!='' && externals!=''){
          total = Number(internals)+Number(externals);
          $("#total"+val).val(total);
          $("#status"+val).val(passFail(val,total,externals,internals));
      }
  });

  $("#addMarksSubjects").on('change','input.externals',function(){
      //call a function to determine the change
      var val = $(this).data('value');
      var internals = $("#internals"+val).val();
      var externals = $("#externals"+val).val();
      var total;
      if(internals!='' && externals!=''){
          total = Number(internals)+Number(externals);
          $("#total"+val).val(total);
          $("#status"+val).val(passFail(val,total,externals,internals));
      }
  })


  $("#addStudentMarksSubmit").click(function(){
    data.usn = $("#addMarksUSN").val();
    data.name = $("#addMarksName").val();
    data.branch = $("#addMarksBranch").val();
    data.semester = $("#addMarksSemester").val();
    data.year = $("#addMarksYear").val();
    data.month = $("#addMarksMonth").val();
    data.percentage = $("#addMarksPercentage").val();
    data.class = $("#addMarksClass").val();
    data.referenceId = subjects._id;
    data.subject = [];
    //iterate through the div to get the values of each element
    $(".subjectMarks").each(function(){
      var json={};
      json.name = $(this).find(".name").val();
      json.code = $(this).find(".code").val();
      json.external = $(this).find(".externals").val();
      json.attempt = [];
      var attemptObject = {};
      attemptObject.valuvation = $(this).find(".externals").val();
      attemptObject.revaluvation = '';
      json.attempt[0] = attemptObject;
      for(var i=1;i<3;i++){
        var attemptObjectIn = {};
        attemptObjectIn.valuvation = '';
        attemptObjectIn.revaluvation = '';
        json.attempt[i] = attemptObjectIn;
      }
      json.internal = $(this).find(".internals").val();
      json.total = $(this).find(".total").val();
      json.status = $(this).find(".status").val();
      data.subject.push(json);
      console.log(json);
    });
    data.sLength = data.subject.length;
    $.ajax({
      type: "POST",
      url: "http://vonturing.in:8080/submitMarks",
      data: data,
      success: function(data){
        //empty the content of marks once submitted
        $("#addMarksUSN").val('');
        $("#addMarksAlertText").text(data);
        $("#addMarksAlert").show();
      },
      error: function(jqxhr,text,status){
        alert(text);
      }
    });
  });


  function passFail(val,total,externals,internals){
    if(subjects.subjects[val].minimumInternals && subjects.subjects[val].minimumInternals > internals)
      return "Fail";
    else if(subjects.subjects[val].minimumExternals && subjects.subjects[val].minimumExternals > externals)
      return "Fail";
    else if(subjects.subjects[val].minimumTotal && subjects.subjects[val].minimumTotal > total)
      return "Fail";
    else
      return "Pass";
  }

  $("#addMarksSubjects").on("propertychange change paste input",".internals",function(){
    var value = $(this).val();
    var subjectNumber = $(this).data('value');
    if(Number(value)>subjects.subjects[subjectNumber].maximumInternals){
      $("#addMarksAlertText").text("Internal marks cannot exceed "+subjects.subjects[subjectNumber].maximumInternals+"!!");
      $("#addMarksAlert").show();
      $(this).val('');
    }
  });

  $("#addMarksSubjects").on("propertychange change paste input",".externals",function(){
    var value = $(this).val();
    var subjectNumber = $(this).data('value');
    if(Number(value)>subjects.subjects[subjectNumber].maximumExternals){
      $("#addMarksAlertText").text("Internal marks cannot exceed "+subjects.subjects[subjectNumber].maximumExternals+"!!");
      $("#addMarksAlert").show();
      $(this).val('');
    }
  });

  $("#addMarksSubjects").on("propertychange change paste input",function(){
    var calcTotal = 0,maxTotal = 0;
    $(this).find('.total').each(function(index){
        calcTotal += Number($(this).val());
        maxTotal += Number(subjects.subjects[index].maximumTotal);
    });
    var percentage = (calcTotal/maxTotal)*100;
    $("#addMarksPercentage").val(percentage.toFixed(2));
    if(percentage>=70)
      $("#addMarksClass").val('FCD');
    else if(percentage>=60)
      $("#addMarksClass").val('FC');
    else if(percentage>=35)
      $("#addMarksClass").val('SC');
    else
      $("#addMarksClass").val('F');
  });
});
