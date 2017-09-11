/*
Name: Brian Allison
Date: 6/10/2017
Course: CS290
Description: DB interactions and UI
*/

document.addEventListener('DOMContentLoaded', buttonLoad);
var url = 'http://flip3.engr.oregonstate.edu:5600';
generateTable();

function buttonLoad() {
	document.getElementById('addSubmit').addEventListener('click', function (event) {

		var request2 = new XMLHttpRequest();
		var workOutName = document.getElementById('workOutName').value;
		var reps = document.getElementById('reps').value;
		var weight = document.getElementById('weight').value;
		var date = document.getElementById('date').value;

		var unitkg = document.getElementById('kg');
		var unitVal;

		if (unitkg.checked) {
			unitVal = 0;
		} else {
			//default to lbs if nothing checked
			unitVal = 1;
		}

		var addURL = url + '/add' + '?n=' + workOutName + '&r=' + reps +
			'&w=' + weight + '&d=' + date + '&l=' + unitVal;

		console.log(addURL);

		request2.open('GET', addURL, true);
		request2.addEventListener('load', function () {
			if (request2.status >= 200 && request2.status < 400) {
				generateTable();
			} else {
				console.log("Network request error: " + request2.statusText);
			}
		});

		request2.send(null);
		event.preventDefault();

	});
}

//generate table with updated data
function generateTable() {
	var request = new XMLHttpRequest();

	request.open('GET', url + "/gentable", true);
	request.addEventListener('load', function () {
		if (request.status >= 200 && request.status < 400) {
			var dataReceived = JSON.parse(request.responseText);
			var dataReceived2 = JSON.parse(dataReceived.tab);
			createTable(dataReceived2);

		} else {
			console.log("Network request error: " + request.statusText);
		}
	});
	request.send(null);
}

//create table with updated data
function createTable(array) {
	console.log(array);
	var table = document.getElementById("newTable");
	var tableBody = document.createElement("tbody");
	var rows = array.length;
	var columns = 6;
	var cells = rows * columns;

	//creates a table body according to the above number of rows
	//and columns
	for (var i = 0; i < rows; i++) {

		var newRow = document.createElement("tr");
		for (var v in array[i]) {
			if (v != "id" && v != "lbs") {
				var newCell = document.createElement("td");
				newCell.textContent = array[i][v];
				if ((v == 'weight') && (array[i]['lbs'] == 1)) {
					newCell.textContent += " lbs";
				}
				if ((v == 'weight') && (array[i]['lbs'] == 0)) {
					newCell.textContent += " kg";
				}
				newRow.appendChild(newCell);
			}

			if (v == "date") {
				var editCell = document.createElement("td");
				var buttonEdit = createButton("edit", array[i]["id"]);
				buttonEdit.addEventListener('click', function (event) {
					event.preventDefault();
					editClick(event.target, array);
				});
				var deleteCell = document.createElement("td");
				var buttonDelete = createButton("delete", array[i]["id"]);
				buttonDelete.addEventListener('click', function (event) {
					event.preventDefault();
					removeClick(event.target);
				});
				editCell.appendChild(buttonEdit);
				newRow.appendChild(editCell);
				deleteCell.appendChild(buttonDelete);
				newRow.appendChild(deleteCell);
			}
		}
		tableBody.appendChild(newRow);
	}
	table.replaceChild(tableBody, table.childNodes[2]);
}

//creates a new button with the text of the passed in string
function createButton(buttonText, name) {
	var button = document.createElement("button");
	button.textContent = buttonText;
	button.name = name;
	return button;
}

//remove item
function removeClick(eSource) {
	var request3 = new XMLHttpRequest();
	var addURL = url + '/remove' + '?id=' + eSource.name;
	console.log(addURL);
	request3.open('GET', addURL, true);
	request3.addEventListener('load', function () {
		if (request3.status >= 200 && request3.status < 400) {
			generateTable();
		} else {
			console.log("Network request error: " + request3.statusText);
		}
	});

	request3.send(null);
}

//edit item
function editClick(eSource, arrayIn) {
	for (var z = 0; z < arrayIn.length; z++) {
		if (arrayIn[z]['id'] == eSource.name) {
			document.getElementById('workOutName').value = arrayIn[z]['name'];
			document.getElementById('reps').value = arrayIn[z]['reps'];
			document.getElementById('weight').value = arrayIn[z]['weight'];
			document.getElementById('date').value = arrayIn[z]['date'];
			var lbs = document.getElementById('lbs');
			var kg = document.getElementById('kg');
			if (arrayIn[z]['lbs'] == 1) {
				kg.checked = false;
				lbs.checked = true;
			} else {
				lbs.checked = false;
				kg.checked = true;
			}
		}
	}
	var buttonUpdate = createButton("UPDATE", "update");
	document.getElementById("addSubmit").replaceWith(buttonUpdate);
	document.getElementById("addLegend").textContent = "UPDATE";
	buttonUpdate.addEventListener('click', function(event){
		event.preventDefault();
		update(eSource.name);
		
	});
}

//update edited item
function update(idIn){

		var workOutName = document.getElementById('workOutName').value;
		var reps = document.getElementById('reps').value;
		var weight = document.getElementById('weight').value;
		var date = document.getElementById('date').value;

		var unitkg = document.getElementById('kg');
		var unitVal;

		if (unitkg.checked) {
			unitVal = 0;
		} else {
			//default to lbs if nothing checked
			unitVal = 1;
		}

		var addURL = url + '/edit' + '?id=' + idIn + '&n=' + workOutName + '&r=' + reps +
			'&w=' + weight + '&d=' + date + '&l=' + unitVal;

		location.href = addURL;
}

/*

var currentIndex = 0;
tableItems[currentIndex].style.borderWidth = "thick";

var div1 = document.createElement("div");
var buttonUp = createButton("Up");
buttonToDiv(buttonUp, div1);

var div2 = document.createElement("div");
var buttonLeft = createButton("Left");
buttonToDiv(buttonLeft, div2);

var buttonRight = createButton("Right");
buttonToDiv(buttonRight, div2);

var div3 = document.createElement("div");
var buttonDown = createButton("Down");
buttonToDiv(buttonDown, div3);

var div4 = document.createElement("div");
var markCell = createButton("Mark Cell");
buttonToDiv(markCell, div4);
div4.style.marginTop = "10px";




var buttons = document.getElementsByTagName("button");

buttons[0].addEventListener("click", up);
buttons[1].addEventListener("click", left);
buttons[2].addEventListener("click", right);
buttons[3].addEventListener("click", down);
buttons[4].addEventListener("click", mark);



//places a button in div that is passed in, then
//appends that div to the body
function buttonToDiv (button, div){
div.appendChild(button);
document.body.appendChild(div);
}

//marks currently selected cell with a yellow background
function mark(){
tableItems[currentIndex].style.backgroundColor = "yellow";
}

//deselects the current cell, selects the cell of
//which the index is passed in, updates current index
function selectCell (index){
tableItems[currentIndex].style.borderWidth = "medium";
tableItems[index].style.borderWidth = "thick";
currentIndex = index;
}

//moves selected cell up
//selected cell remains the same if current is already farLeft
function up(){
var top = false;
for (var i = 0; i < rows; i++){
if (tableItems[i] == tableItems[currentIndex]){
top = true;
}
}
if (top == false){
var newIndex = currentIndex - columns;
selectCell(newIndex);
}
}

//moves selected cell down
//selected cell remains the same if current is already at bottom
function down(){
var bottom = false;
for (var i = cells - columns; i < cells; i++){
if (tableItems[i] == tableItems[currentIndex]){
bottom = true;
}
}
if (bottom == false){
var newIndex = currentIndex + columns;
selectCell(newIndex);
}
}

//moves selected cell to the right
//selected cell remains the same if current is already farRight
function right(){
var farRight = false;
for (var i = columns - 1; i < cells; i += columns){
if (tableItems[i] == tableItems[currentIndex]){
farRight = true;
}
}
if (farRight == false){
var newIndex = currentIndex + 1;
selectCell(newIndex);
}
}

//moves selected cell to the left
//selected cell remains the same if current is already farLeft
function left(){
var farLeft = false;
for (var i = 0; i < cells - 3; i += columns){
if (tableItems[i] == tableItems[currentIndex]){
farLeft = true;
}
}
if (farLeft == false){
var newIndex = currentIndex - 1;
selectCell(newIndex);
}
}
*/