console.log("Inside dbFormSetup.js");
document.addEventListener('DOMContentLoaded', bindTestButton);
document.addEventListener('DOMContentLoaded', setCurrentDate);

function bindTestButton() {
	document.getElementById('inputButton').addEventListener('click', function(event){
		/* Check if all fields are filled */
		var status = {};
		if (document.getElementById('inputName').value == "") {
			alert("Enter an exercise name");
		}
		else {
			document.getElementById('testSpan').textContent = "It Worked!";
			console.log("Success!");
		}
		event.preventDefault();
	});
}


/* Code for setting date from: http://stackoverflow.com/questions/6982692/html5-input-type-date-default-value-to-today */
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function setCurrentDate() {
	document.getElementById('inputDate').value = new Date().toDateInputValue();
}