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
					else {
						console.log(response);
						/* Insert adapted from: http://stackoverflow.com/questions/18333427/how-to-insert-row-in-html-table-body-in-javascript */
						var table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
						var newRow = table.insertRow(table.rows.length);
						/* Get cell contents */
						var newContent = [];
						newContent[0] = document.getElementById('inputName').value;
						newContent[1] = document.getElementById('inputReps').value;
						newContent[2] = document.getElementById('inputWeight').value + " " + selectWeightType.options[selectWeightType.selectedIndex].text;
						newContent[3] = (new Date(document.getElementById('inputDate').value)).toUTCString();
						/* Add cells to table */
						for (i = 0; i < newContent.length; i++) {
							var newCell = newRow.insertCell(i);
							var newText = document.createTextNode(newContent[i]);
							newCell.appendChild(newText);
							newRow.appendChild(newCell);
						}
						/* Add Update button */
						var upCell = newRow.insertCell(newContent.length);
						upCell.innerHTML = '<form method="GET" action="/update">\n<input type="hidden" name="id" value="' + response.insertId + '"></input>\n<input type="submit" value="Update"></input>\n</form>'
						newRow.appendChild(upCell);
						/* Add Delete button */
						var delCell = newRow.insertCell(newContent.length + 1);
						delCell.innerHTML = '<input type="button" value="Delete" onclick="deleteRow(\'dataTable\',this,' + response.insertId + ')"></input>';
						newRow.appendChild(delCell);
						/* Add row to table */
						table.appendChild(newRow);
						
					}
				}
				else {
					console.log(req.status + ":" + req.statusText);
				}
			});
			req.send(JSON.stringify(payload));
		}
	});
}

function setCurrentDate() {
	document.getElementById('inputDate').valueAsDate = new Date();
}

/* Delete Table Row adapted from: http://jsfiddle.net/GRgMb/ */
function deleteRow(tableID,currentRow,rowID) {
	var req = new XMLHttpRequest();
	var payload = {type:'Delete',id:rowID};
	req.open('POST','/',true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function() {
		if (req.status >= 200 && req.status < 400) {
			/* Check Response */
			var response = JSON.parse(req.responseText);
			if (response.SQL_ERROR) {
				console.log(response.SQL_ERROR);
			}
			else {
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
		}
		else {
			console.log(req.status + ":" + res.statusText);
		}
	});
	req.send(JSON.stringify(payload));
}