console.log("Inside test.js");
document.addEventListener('DOMContentLoaded', bindTestButton);

function bindTestButton() {
	document.getElementById('testButton').addEventListener('click', function(event){
		document.getElementById('testSpan').textContent = "It Worked!";
		console.log("Success!");
		event.preventDefault();
	});
}