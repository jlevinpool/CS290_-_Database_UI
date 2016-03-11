document.addEventListener('DOMContentLoaded', bindTestButton);
document.addEventListener('DOMContentLoaded', setCurrentDate);

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
			var payload = {type:'Insert',
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


/* Code for setting date from: http://stackoverflow.com/questions/6982692/html5-input-type-date-default-value-to-today */
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function setCurrentDate() {
	document.getElementById('inputDate').value = new Date().toDateInputValue();
}

/* Delete Table Row adapted from: http://jsfiddle.net/GRgMb/ */
function deleteRow(tableID,currentRow,rowID) {
	var req = new XMLHttpRequest();
	var payload = {type:'Delete',id:rowID};
	req.open('POST','/',true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function() {
		if (req.status >= 200 && req.status < 400) {
			/* Remove row from table */
			try {
			var table = document.getElementById(tableID);
			var rowCount = table.rows.length;
			for (var i = 0; i < rowCount; i++) {
				var row = table.rows[i];
				if (row==currentRow.parentNode.parentNode) {
					if (rowCount < 1) {
						alert("Cannot delete row from empty table.");
						break;
					}
					table.deleteRow(i);
					rowCount--;
					i--;
				}
			}
			} catch (e) {
				alert(e);
			}
		}
		else {
			console.log(req.status + ":" + res.statusText);
		}
	});
	req.send(JSON.stringify(payload));
}