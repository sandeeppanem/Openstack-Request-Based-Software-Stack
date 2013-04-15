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
		var strURL = "http://10.2.4.216:8081/login?name=" + username + "&password=" + password + "&callback=?";
//		var strURL = "http://10.2.4.216:8081/login?name=admin&password=sachinss&callback=?";
//		var strURL = "http://10.2.4.216:8081/flavor/types?callback=?";
//		var strURL = "http://10.2.4.216:8081/login?name=admin&password=sachinss";
//		var strURL = "http://10.2.4.216:8081/login";
		alert("URL to be hit : " + strURL);
		$("#loading-image").removeClass("hidden");
		$.ajax({
			 url:strURL,
		      timeout:10000,
		      async: true,
		      type: 'GET',
		      dataType: 'jsonp',
		      crossDomain:true,
		      success: function(result){
			alert("success");
			$("#loading-image").addClass("hidden");
			/*   innerHTML = "";
				innerHTML = innerHTML + "<h2>Type : "+result.status+"</h2>";
				$("#success").append(innerHTML);*/
			},
			error: function(req, error) { 
	//			alert("error");
				$("#loading-image").addClass("hidden");
				console.log(req);
				console.log(error);
				alert("AJAX-JSON Error : "+req.error);
			}
		});
	}
}
