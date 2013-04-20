var var1 = getUrlVars()["l"];


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function loadUbuntuSoftwares()
{
	var outerdiv = document.getElementsByClassName('form-single-column')[2];
	var firstspan,newCheckBox,label;
	firstspan =  document.createElement("span");
	firstspan.className = "form-checkbox-item";
	firstspan.style.clear = 'left';
	newCheckBox = document.createElement('input');
	newCheckBox.type = 'checkbox';
	newCheckBox.id = 'input_3_3_1'; // need unique Ids!
	newCheckBox.className = "form-checkbox";
	newCheckBox.name = "q1_installSoftwares[]";
	newCheckBox.value = "VirtualBox";
	firstspan.appendChild(newCheckBox);
	label = document.createElement("label");
	label.setAttribute("for",'input_3_3_1');
	label.innerHTML = "Virtual Box";
	firstspan.appendChild(label);
	outerdiv.appendChild(firstspan);
	
	firstspan =  document.createElement("span");
	firstspan.className = "form-checkbox-item";
	firstspan.style.clear = 'left';
	newCheckBox = document.createElement('input');
	newCheckBox.type = 'checkbox';
	newCheckBox.id = 'input_3_3_2' ;// need unique Ids!
	newCheckBox.className = "form-checkbox";
	newCheckBox.name = "q1_installSoftwares[]";
	newCheckBox.value = "WebDevelopment";
	firstspan.appendChild(newCheckBox);
	label = document.createElement("label");
	label.setAttribute("for",'input_3_3_2');
	label.innerHTML = "Web Development";
	firstspan.appendChild(label);
	outerdiv.appendChild(firstspan);
	
	firstspan =  document.createElement("span");
	firstspan.className = "form-checkbox-item";
	firstspan.style.clear = 'left';
	newCheckBox = document.createElement('input');
	newCheckBox.type = 'checkbox';
	newCheckBox.id = 'input_3_3_3'; // need unique Ids!
	newCheckBox.className = "form-checkbox";
	newCheckBox.name = "q1_installSoftwares[]";
	newCheckBox.value = "Acrobat";
	firstspan.appendChild(newCheckBox);
	label = document.createElement("label");
	label.setAttribute("for",'input_3_3_3');
	label.innerHTML = "Acrobat";
	firstspan.appendChild(label);
	outerdiv.appendChild(firstspan);
	
	firstspan =  document.createElement("span");
	firstspan.className = "form-checkbox-item";
	firstspan.style.clear = 'left';
	newCheckBox = document.createElement('input');
	newCheckBox.type = 'checkbox';
	newCheckBox.id = 'input_3_3_4'; // need unique Ids!
	newCheckBox.className = "form-checkbox";
	newCheckBox.name = "q1_installSoftwares[]";
	newCheckBox.value = "Dropbox";
	firstspan.appendChild(newCheckBox);
	label = document.createElement("label");
	label.setAttribute("for",'input_3_3_4');
	label.innerHTML = "DropBox";
	firstspan.appendChild(label);
	outerdiv.appendChild(firstspan);
}

function loadFedoraSoftwares()
{
	var outerdiv = document.getElementsByClassName('form-single-column')[2];
	var firstspan,newCheckBox,label;
	firstspan =  document.createElement("span");
	firstspan.className = "form-checkbox-item";
	firstspan.style.clear = 'left';
	newCheckBox = document.createElement('input');
	newCheckBox.type = 'checkbox';
	newCheckBox.id = 'input_3_3_1'; // need unique Ids!
	newCheckBox.className = "form-checkbox";
	newCheckBox.name = "q1_installSoftwares[]";
	newCheckBox.value = "Virtual Box";
	firstspan.appendChild(newCheckBox);
	label = document.createElement("label");
	label.setAttribute("for",'input_3_3_1');
	label.innerHTML = "Virtual Box";
	firstspan.appendChild(label);
	outerdiv.appendChild(firstspan);
	
	firstspan =  document.createElement("span");
	firstspan.className = "form-checkbox-item";
	firstspan.style.clear = 'left';
	newCheckBox = document.createElement('input');
	newCheckBox.type = 'checkbox';
	newCheckBox.id = 'input_3_3_2' ;// need unique Ids!
	newCheckBox.className = "form-checkbox";
	newCheckBox.name = "q1_installSoftwares[]";
	newCheckBox.value = "Java";
	firstspan.appendChild(newCheckBox);
	label = document.createElement("label");
	label.setAttribute("for",'input_3_3_2');
	label.innerHTML = "Java";
	firstspan.appendChild(label);
	outerdiv.appendChild(firstspan);
	
	firstspan =  document.createElement("span");
	firstspan.className = "form-checkbox-item";
	firstspan.style.clear = 'left';
	newCheckBox = document.createElement('input');
	newCheckBox.type = 'checkbox';
	newCheckBox.id = 'input_3_3_3'; // need unique Ids!
	newCheckBox.className = "form-checkbox";
	newCheckBox.name = "q1_installSoftwares[]";
	newCheckBox.value = "Acrobat";
	firstspan.appendChild(newCheckBox);
	label = document.createElement("label");
	label.setAttribute("for",'input_3_3_3');
	label.innerHTML = "Acrobat";
	firstspan.appendChild(label);
	outerdiv.appendChild(firstspan);

}


function create()
{
	//alert(document.getElementById("input_3_1_0").value);
	if(document.getElementById("input_3_1_0").value.length==0)
	{
		alert("Enter Server Name");
		return;
	}
	var serverName=document.getElementById("input_3_1_0").value;
	var image="";
	var flavor="";
//	document.getElementById("flavors").click();
	var inputs = document.getElementsByName("q3_availableImages");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        image = inputs[i].value;
      }
    }
    
    inputs = document.getElementsByName("q1_availableFlavors[]");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        flavor = inputs[i].value;
      }
    }
    
    if(image.length==0)
    {
    	alert("Choose Image");
    	return;
    }
    
    if(flavor.length==0)
    {
    	alert("Choose flavor");
    	return;
    }
    
    var checkboxes = document.getElementsByName("q1_installSoftwares[]");
    var checkboxesChecked = [];
    var count=0;
    for (var i=0; i<checkboxes.length; i++) {
       if (checkboxes[i].checked) {
          checkboxesChecked.push(checkboxes[i]);
         // alert(checkboxes[i].value);
          count++;
       }
    }
    //alert("here ahead");
    flavor = parseInt(flavor);
    //alert(flavor);
    var strURL = "http://10.2.4.216:8082/vm/create";
    //alert("URL to be hit : " + strURL);
//    $("#loading-image").removeClass("hidden");
    jQuery.noConflict();
    //alert("before getdata");
    
    
   var getdata = {};
   var valuedata = {};
   var list=[];
   for (var i = 0; i < checkboxesChecked.length; i++) {
       //alert(checkboxesChecked[i].value);
       list.push(checkboxesChecked[i].value);
   }
   valuedata["instance_name"] = serverName;
   valuedata["image_name"] = image;
   valuedata["flavor_type"] = flavor;
   valuedata["software_list"] = list;
   getdata["1"]=valuedata;
    //alert(getdata);
    //alert(JSON.stringify(getdata));
    jQuery.ajax({url:strURL,
            type: "POST",
            data:{"getdata":JSON.stringify(getdata)},
           // data:{"getdata":getdata},
            dataType: "json",
            crossDomain:true,
            timeout:10000,     
            success: function(result)
            {
            	console.log(result);
            	alert("Created successfully");
            	//alert("now layers are " + var1);
            	var1 = var1-1;
            	//alert("next layers is " + var1);
            	if(var1==0){
            		//alert("no more layers left");
            		window.location.href="VM_page.html";
            	}
            	else{
            		window.location='createInstance.html?l=' + var1;
            	}
    //        	$("#loading-image").addClass("hidden");

            },
            error: function(req, error) 
            { 
//            	$("#loading-image").addClass("hidden");
            	console.log(req);
            	console.log(error);
            	alert("AJAX-JSON Error : "+req.error);
            }
    });
}

function loadPageSoftwares()
{
	
	var image="";
//	document.getElementById("flavors").click();
	var inputs = document.getElementsByName("q3_availableImages");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        image = inputs[i].value;
      }
    }
    if(image.length==0)
    {
    	//alert("Choose Image First");
    	return;
    }
 
	 if(image.indexOf("fedora")!=-1)
	 {
		 loadFedoraSoftwares();
	 }
	 else
	 {
	  	loadUbuntuSoftwares();
	 }
}

function loadPageImages(){
	//alert("l is " + var1);
//	alert(location.search);
	//alert("In load images");
	var strURL = "http://10.2.4.216:8082/image/list?callback=?";
	var outerdiv = document.getElementsByClassName('form-single-column')[0];
	jQuery.noConflict();
	outerdiv.innerHTML="<p>Loading....";
	jQuery.ajax({
		url:strURL,
	    type: "POST",
	    data:{},
	    dataType: "json",
	    crossDomain:true,
	    timeout:10000,     
	    success: function(result)
	    {
			var count = 1;
			console.log(result);
	//		alert(result.images);
			outerdiv.innerHTML="";
			 jQuery.each(result.images, function(key, val) {
                 //alert(result.images[key].id + "  " + result.images[key].name);
          	var firstspan =  document.createElement("span");
			firstspan.className = "form-radio-item";
			firstspan.style.clear = 'left';
			var newCheckBox = document.createElement('input');
				newCheckBox.type = 'radio';
				newCheckBox.id = 'input_3_1_' + count; // need unique Ids!
				newCheckBox.className = "form-radio";
				newCheckBox.name = "q3_availableImages";
				newCheckBox.value = result.images[key].name;
				firstspan.appendChild(newCheckBox);
				var label = document.createElement("label");
				label.setAttribute("for",'input_3_1_' + count);
				label.innerHTML = result.images[key].name;
				firstspan.appendChild(label);
				outerdiv.appendChild(firstspan);
				count = count+1;
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

function loadPageFlavors()
{
	//alert("In load flavors");
	var strURL = "http://10.2.4.216:8082/flavor/types?callback=?";
	var outerdiv = document.getElementsByClassName('form-single-column')[1];
	outerdiv.innerHTML="<p>Loading....";
	jQuery.noConflict();
	jQuery.ajax({
		url: strURL,
	    type: "GET",
	    //data:{},
	    dataType: "json",
	    crossDomain:true,
	    timeout:10000,     
	    success: function(result)
	    {
			var count = 1;
			console.log(result);
			//alert(result.flavors);
			outerdiv.innerHTML="";
			 jQuery.each(result.flavors, function(key, val) {
   //             alert(result.flavors[key].ram + "  " + result.flavors[key].vcpus);
	          	var firstspan =  document.createElement("span");
				firstspan.className = "form-radio-item";
				firstspan.style.clear = 'left';
				var newRadioButton = document.createElement('input');
				newRadioButton.type = 'radio';
				newRadioButton.id = 'input_3_2_' + count; // need unique Ids!
				newRadioButton.className = "form-radio";
				newRadioButton.name = "q1_availableFlavors[]";
				newRadioButton.value = result.flavors[key].flavor_id;
				firstspan.appendChild(newRadioButton);
				var label = document.createElement("label");
				label.setAttribute("for",'input_3_2_' + count);
				label.innerHTML = "disk : " + result.flavors[key].disk + " ram : " + result.flavors[key].ram + " vcpus : " + result.flavors[key].vcpus;
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

