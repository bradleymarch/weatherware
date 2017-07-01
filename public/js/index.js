$(function() {

	function myFunction() {
		var x = document.getElementById("myTopNav");
		if (x.className === "navbar") {
			x.className += " responsive";
		} else {
			x.className = "navbar";
		}
	}	

});