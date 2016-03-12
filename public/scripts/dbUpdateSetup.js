document.addEventListener('DOMContentLoaded', bindTestButton);

function bindTestButton() {
	document.getElementById('inputButton').addEventListener('click', function(event){
		/* Check if all fields are filled */
		var status = {};
		event.preventDefault();
		if (document.getElementById('inputName').value == "") {
			alert("Enter an exercise name");
		}
		else {
			var req = new XMLHttpRequest();
			/* Pull form data */
			var selectWeightType = document.getElementById('inputWeightType');
			var payload = {type:'Update',
				name:document.getElementById('inputName').value,
				reps:document.getElementById('inputReps').value,
				weight:document.getElementById('inputWeight').value,
				weightUnit:selectWeightType.options[selectWeightType.selectedIndex].value,
				date:document.getElementById('inputDate').value
				}
			req.open('POST','/',true);
			req.setRequestHeader('Content-Type', 'application/json');
			req.addEventListener('load',function() {
				if (req.status >= 200 && req.status < 400) {
					var response = JSON.parse(req.responseText);
					if (response.SQL_ERROR) {
						console.log(response.SQL_ERROR);
					}
				}
				else {
					console.log(req.status + ":" + res.statusText);
				}
			});
			req.send(JSON.stringify(payload));
		}
	});
}