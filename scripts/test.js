document.addEventListener('DOMContentLoaded', bindTestButton);

function bindTestButton() {
	document.getElementById('testButton').addEventListener('click', function(event){
		console.log("Success!");
		event.preventDefault();
	});
}