function loadPage1()
{
	
	//alert("hereee");
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
	    	var outerdiv = document.getElementsByClassName('form-single-column')[0];
			var count = 1;
			console.log(result);
			//alert(result.servers);
			
			 jQuery.each(result.servers, function(key, val) {
                //alert(result.servers[key].instance_name);
	          	var firstspan =  document.createElement("span");
				firstspan.className = "form-radio-item";
				firstspan.style.clear = 'left';
				var newRadioButton = document.createElement('input');
				newRadioButton.type = 'radio';
				newRadioButton.id = 'input_3_0_' + count; // need unique Ids!
				newRadioButton.className = "form-radio";
				newRadioButton.name = "q1_runningVM[]";
				newRadioButton.value = result.servers[key].instance_name;
				firstspan.appendChild(newRadioButton);
				var label = document.createElement("label");
				label.setAttribute("for",'input_3_0_' + count);
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

function view(){
	var getdata = "";
	var inputs = document.getElementsByName("q1_runningVM[]");
    for (var j = 0; j < inputs.length; j++) {
      if (inputs[j].checked) {
    	  //alert(inputs[j].value);
        getdata = inputs[j].value;
      }
    }
    alert("VM running is " + getdata);
    
}