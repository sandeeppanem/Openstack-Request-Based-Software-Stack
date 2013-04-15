function validate() 
{
		var strURL = "http://10.2.4.216:8082/vm/create";
                alert("hello");
		alert("URL to be hit : " + strURL);
		$("#loading-image").removeClass("hidden");
                jQuery.support.cors = true;
                var getdata ={
    "1": {
        "instance_name": "myserver",
        "image_name": "ubuntu-total-configured",
        "flavor_type": 1,
        "software_list": [
            "VirtualBox",
            "Dropbox"
        ]
    }
}
		$.ajax({url:strURL,
                        type: "POST",
                        data:{"getdata":JSON.stringify(getdata)},
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
