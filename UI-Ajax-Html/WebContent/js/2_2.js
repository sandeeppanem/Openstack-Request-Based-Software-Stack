
function loadPage2()
{
	//alert("in loadpage2");
	//alert(document.getElementById("input_1").value);
	layers = document.getElementById("input_1").value;
	document.layer = layers;
	//alert(document.layer);
	for( var i=0;i<layers;i++)
	{
//		alert(i);
		window.location='createInstance.html?l=' + layers;
	}
	
}