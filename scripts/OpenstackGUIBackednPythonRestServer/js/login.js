function validate() 
{
	var username = document.getElementsByName("username")[0].value;
	var password = document.getElementsByName("password")[0].value;

	if(username=='' && password==''){
		alert("Please enter all fields");
		
	}
	if(username==''){
		alert("Please enter valid Username");
	}
	else if(password==''){
		alert("Please enter valid Password");
	}
	else {
		var strURL = "http://10.2.4.216:8082/login";
                alert("hello");
		alert("URL to be hit : " + strURL);
		$("#loading-image").removeClass("hidden");
                jQuery.support.cors = true;
		$.ajax({url:strURL,
                        type: "POST",
                        data:{"name":username,"pass":password},
		        dataType: "json",
                        crossDomain:true,
                        timeout:10000,     
		        success: function(result){
                        console.log(result);
   innerHTML = "";
				innerHTML = innerHTML + "<h2>Type : "+result.status+"</h2>";
				$("#success").append(innerHTML);
			alert("success");
			$("#loading-image").addClass("hidden");
			
			},
			error: function(req, error) { 
				$("#loading-image").addClass("hidden");
				console.log(req);
				console.log(error);
				alert("AJAX-JSON Error : "+req.error);
			}
		});
	}
}
