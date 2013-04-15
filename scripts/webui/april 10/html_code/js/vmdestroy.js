function validate() 
{
		
                var getdata = "sandeep"
                var strURL = "http://10.2.4.216:8082/vm/destroy?server_name=" + getdata + "&callback=?";
                alert("hello");
		alert("URL to be hit : " + strURL);
		$("#loading-image").removeClass("hidden");
                jQuery.support.cors = true;
		$.ajax({url:strURL,
                        type: "GET",
                        dataType: "jsonp",
                        async:true,
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
