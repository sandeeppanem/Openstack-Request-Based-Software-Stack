function validate() 
{
	var username = document.getElementsByName("username_box")[0].value;
	var password = document.getElementsByName("password_box")[0].value;

	if(username=='' && password==''){
		alert("Please enter all fields");
		return false;
		
	}
	if(username==''){
		alert("Please enter valid Username");
		return false;
	}
	else if(password==''){
		alert("Please enter valid Password");
		return false;
	}
	else {
		var strURL = "http://10.2.4.216:8082/login";
		//alert("URL to be hit : " + strURL);
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
                        $("#loading-image").addClass("hidden");
                        if(result.status == 0)
                        {
                        	alert("fail");
                        	return false;
                        }
                        else
                        {
                        	alert("login successful");
                        	window.location='VM_page.html';
                        	return true;
                        }
                        
			},
			error: function(req, error) { 
				$("#loading-image").addClass("hidden");
				console.log(req);
				console.log(error);
				alert("AJAX-JSON Error : "+req.error);
				return false;
			}
		});
	}
}
