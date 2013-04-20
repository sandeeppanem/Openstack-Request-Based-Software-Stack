function loadDestroyPage()
{
	
	//alert("hereee in destroy");
	var strURL = "http://10.2.4.216:8082/instances/list?callback=?";
	
	jQuery.noConflict();
	jQuery.ajax({
		url: strURL,
	    type: "POST",
	    //data:{},
	    dataType: "json",
	    crossDomain:true,
	    timeout:10000,     
	    success: function(result)
	    {
	    	var outerdiv = document.getElementsByClassName('form-single-column')[1];
			var count = 1;
			console.log(result);
		//	alert(result.servers);
			
			 jQuery.each(result.servers, function(key, val) {
                //alert(result.servers[key].instance_name);
	          	var firstspan =  document.createElement("span");
				firstspan.className = "form-radio-item";
				firstspan.style.clear = 'left';
				var newRadioButton = document.createElement('input');
				newRadioButton.type = 'radio';
				newRadioButton.id = 'input_22_' + count; // need unique Ids!
				newRadioButton.className = "form-radio";
				newRadioButton.name = "q1_destroyVM[]";
				newRadioButton.value = result.servers[key].instance_name;
				firstspan.appendChild(newRadioButton);
				var label = document.createElement("label");
				label.setAttribute("for",'input_22_' + count);
				label.innerHTML = result.servers[key].instance_name;
				firstspan.appendChild(label);
				outerdiv.appendChild(firstspan);
				count++;
			});
	    },
	    error: function(req, error) { 
	//$("#loading-image").addClass("hidden");
	    	console.log(req);
	    	console.log(error);
	    	alert("AJAX-JSON Error : "+req.error);
	    }
	    });
}

function destroy(){
	var getdata = "";
	var inputs = document.getElementsByName("q1_destroyVM[]");
    for (var j = 0; j < inputs.length; j++) {
      if (inputs[j].checked) {
    	  //alert(inputs[j].value);
        getdata = inputs[j].value;
      }
    }
    //alert(getdata);
    var strURL = "http://10.2.4.216:8082/vm/destroy?server_name=" + getdata + "&callback=?";
	//alert("hello in destroy");
//	alert("URL to be hit : " + strURL);
//	$("#loading-image").removeClass("hidden");
	jQuery.support.cors = true;
	jQuery.ajax({url:strURL,
	            type: "GET",
	            dataType: "jsonp",
	            async:true,
	            crossDomain:true,
	            timeout:10000,     
	    success: function(result){
	            console.log(result);
	alert("Deletion successful");
	window.location.reload('VM_page.html');
	//$("#loading-image").addClass("hidden");
	
	},
	error: function(req, error) { 
		$("#loading-image").addClass("hidden");
		console.log(req);
		console.log(error);
		alert("AJAX-JSON Error : "+req.error);
	}
	});
    
    
}