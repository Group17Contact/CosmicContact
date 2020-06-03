var urlBase = 'http://cosmiccontact.space/';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogIn()
{
	// Set userId to 0 and loginResult to an empty string for error handling purposes
	userId = 0;
	document.getElementById("loginResult").innerHTML = "";

	// Get the username and password typed in by the user
	var username = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	//var hash = md5( password );

	// Setup the json that will be sent to the server and the url
	//var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = JSON.stringify({username:username, password:password});
	var url = urlBase + '/api/Login.' + extension;

	// Prep for sending the json payload to the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState !== 4)
				return;

			// Parse the response from the server
			var jsonObject = JSON.parse(xhr.responseText);

			if (this.status !== 200)
			{
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
				return;
			}

			// Set the userId and check to make sure it was changed, if so, print the error and return
			userId = jsonObject.userId;

			firstName = jsonObject.firstName;
			lastName = jsonObject.lastName;

			saveCookie();

			location.href = "contacts.html";
		};

		// Send the json payload to the server
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogout()
{
	userId = 0;
	// TODO: Send a hit to logout endpoint
	//document.getElementById("username").value = "";
	//document.getElementById("userPassword").value = "";
	//document.getElementById("firstName").value = "";
	//document.getElementById("lastName").value = "";
	document.cookie = "userData= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doRegistration()
{
   // Set userId to 0 and loginResult to an empty string for error handling purposes
   userId = 0;
   document.getElementById("loginResult").innerHTML = "";

   // Get the username and password typed in by the user
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var username = document.getElementById("username").value;
	var password = document.getElementById("userPassword").value;

   // Setup the json that will be sent to the server and the url
   var jsonPayload = JSON.stringify({firstName:firstName, lastName:lastName, username:username, password:password});
	var url = urlBase + '/api/Register.' + extension;

   // Prep for sending the json payload to the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");

	try
	{
      xhr.onreadystatechange = function()
		{
			if (this.readyState !== 4)
				return;

         // Parse the response from the server
			var jsonObject = JSON.parse(xhr.responseText);

			if (this.status !== 200)
			{
				document.getElementById("loginResult").innerHTML = jsonObject.error;
            	return;
			}

         // Set the userId and check to make sure it was changed, if so, print error and return
         userId = jsonObject.userId;
			window.firstName = firstName;
			window.lastName = lastName;
			//firstName = jsonObject.firstName;
			//lastName = jsonObject.lastName;

			saveCookie();

			window.location.href = "contacts.html";
		};

		// Send the json payload to the server
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	var userData = {firstName: firstName, lastName: lastName, userId: userId};
	document.cookie = "userData=" + encodeURIComponent(JSON.stringify(userData))+ ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(";");
	for (var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] !== "userData")
			continue;
		var userData = JSON.parse(decodeURIComponent(tokens[1]));
		userId = userData.userId;
		firstName = userData.firstName;
		lastName = userData.lastName;
		break;
	}

	if (userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("Greating").innerText = firstName + " " + lastName;
	}
}

function addContact()
{
   // Get the contact info from the HTML
   var fName = document.getElementById("firstName").value;
   var lName = document.getElementById("lastName").value;
   var email = document.getElementById("email").value;
   var phone = document.getElementById("phoneNumber").value;
   document.getElementById("addContactResult").innerHTML = "";

   // Prepare to send the contact info to the server
   var jsonPayload = '{"userId" : "' + userId + '", "firstname" : "' + fName + '", "lastname" : "' + lName + '", "email" : "' + email + '", "phone" : "' + phone + '"}';
   var url = urlBase + '/api/AddContact.' + extension;

   // Create and open a connection to the server
   var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

   try
	{
      // Send the json payload
      xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
            var table = document.getElementById('table');
            var tr = document.createElement("tr");

            tr.innerHTML = '<td>' + document.getElementById("firstname").value + '</td>' +
            '<td>' + document.getElementById("lastname").value + '</td>' +
            '<td>' + document.getElementById("email").value + '</td>' +
            '<td>' + document.getElementById("phone").value + '</td>';
            table.appendChild(tr);

            // Clear the add contact fields
            document.getElementById("firstname").value = "";
            document.getElementById("lastname").value = "";
				document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("addContactResult").innerHTML = "Contact has been added";
            // deleteTable();
            // retrieveContacts();
			}
		};
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}
function makeRow(label, value, className) {
	var tr = document.createElement("tr");
	var labelTd = document.createElement("td");
	labelTd.innerText = label;
	var valueTd = document.createElement("td");
	var valueInput = document.createElement("input");
	valueInput.type = "text";
	valueInput.value = value;
	valueInput.readOnly = true;
	valueInput.classList.add(className);
	valueTd.appendChild(valueInput);
	
	tr.appendChild(labelTd);
	tr.appendChild(valueTd);
	return tr;
}
function makeCollapse(button, content) {
	button.addEventListener("click", function() 
	{
	  button.classList.toggle("active");
	  if (content.style.display === "block") 
	  {
		content.style.display = "none";
	  } else 
	  {
		content.style.display = "block";
	  }
	});
}

function setupDelete(entry, deleteBtn, contactId) {
	deleteBtn.addEventListener("click", function () {
		var data = {userId: userId, contactId: contactId};
		var url = urlBase + 'api/DeleteContact.' + extension;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.onload = function () {
			var res = JSON.parse(xhr.responseText);
			// TODO: different responses...
			entry.remove();
		}
		xhr.send(JSON.stringify(data));
	});
}
function onClickSearch() {
	var el = document.getElementById("searchInput");
	performSearch(el.value);
}

function setupEdit(entry, editBtn, contactId) {
	var editMode = false;
	editBtn.addEventListener("click", function (){
		var firstNameIn = entry.getElementsByClassName("firstName")[0];
		var lastNameIn = entry.getElementsByClassName("lastName")[0];
		var emailIn = entry.getElementsByClassName("email")[0];
		var phoneIn = entry.getElementsByClassName("phone")[0];
		editMode = !editMode;
		firstNameIn.readOnly = !editMode;
		lastNameIn.readOnly = !editMode;
		emailIn.readOnly = !editMode;
		phoneIn.readOnly = !editMode;
		if (editMode) {
			editBtn.innerText = "Save";
		} else {
			editBtn.disabled = true;
			editBtn.innerText = "Saving...";
			var data = {userId: userId, contactId: contactId, firstname: firstNameIn.value, lastname: lastNameIn.value,
			email: emailIn.value,
			phone: phoneIn.value};
			var url = urlBase + 'api/UpdateContact.' + extension;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			xhr.onload = function () {
				var res = JSON.parse(xhr.responseText);
				editBtn.disabled = false;
				editBtn.innerText = "Edit";

			};
			xhr.send(JSON.stringify(data));
		}
	});
}
function performSearch(search) {
	var data = {userId: userId, keyword: search};
	var url = urlBase + 'api/SearchContact.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	var searchResultsDiv = document.getElementById("searchResultsDiv");
	xhr.onload = function () {
		var res = JSON.parse(xhr.responseText);
		searchResultsDiv.innerHTML = "";
		if (res.error || res.Message) {
			var message = document.createElement("div");
			message.classList.add("searchMessage");
			message.innerText = res.error || res.Message;
			searchResultsDiv.appendChild(message);
			return;
		}

		var results = res.results;
		for (var result of results) {
			var entry = document.createElement("div");
			var a = document.createElement("button");
			a.classList.add("collaps");
			a.innerText = result.firstName + " " + result.lastName;
			entry.appendChild(a);
			var content = document.createElement("div");
			var table = document.createElement("table");
			content.classList.add("content");

			var firstNameTr = makeRow("First name:", result.firstName, "firstName");
			table.appendChild(firstNameTr);
			
			var lastNameTr = makeRow("Last name:", result.lastName, "lastName");
			table.appendChild(lastNameTr);

			var emailTr = makeRow("Email:", result.email, "email");
			table.appendChild(emailTr);

			var phoneTr = makeRow("Phone #:", result.phone, "phone");
			table.appendChild(phoneTr);

			var dateTr = document.createElement("tr");
			var labelTd = document.createElement("td");
			labelTd.innerText = "Date created:";
			dateTr.appendChild(labelTd);
			var valueTd = document.createElement("td");
			valueTd.innerText = result.date;
			dateTr.appendChild(valueTd);

			table.append(dateTr);
			content.appendChild(table);
			var buttons = document.createElement("div");
			var deleteButton = document.createElement("button");
			deleteButton.classList.add("deleteContact");
			deleteButton.innerText = "Delete Contact";
			setupDelete(entry, deleteButton, parseInt(result.contactId));
			buttons.appendChild(deleteButton);

			var editButton = document.createElement("button");
			editButton.classList.add("Edit");
			editButton.innerText = "Edit";
			buttons.appendChild(editButton);
			setupEdit(entry, editButton, parseInt(result.contactId));
			content.appendChild(buttons);
			entry.appendChild(content);
			makeCollapse(a, content);
           
			
			searchResultsDiv.appendChild(entry);
		}
	}
	xhr.send(JSON.stringify(data));
}
function retrieveContacts()
{
//   document.getElementById("contactRetrieveResult").innerHTML = "";
   var jsonPayload = '{"userId" : "' + userId + '"}';
   var url = urlBase + 'api/retrieveContacts.' + extension;

   var xhr = new XMLHttpRequest();
   xhr.open("POST", url, true);
   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

   try
   {
      xhr.send(jsonPayload);

      xhr.onreadystatechange = function()
      {
         if (this.readyState == 4 && this.status == 200)
         {
            var jsonObject = JSON.parse(xhr.responseText);
            //contactId = jsonObject.tableId;
            if(jsonObject.error.length > 0)
			   {
				   document.getElementById("searchContactResult").innerHTML = "No contacts were found.";
				   return;
			   }

            var i;
            for (i = 0; i < jsonObject.firstName.length; i++)
				{
               var table = document.getElementById('table');
               var tr = document.createElement("tr");
               s = jsonObject.userId[i];

               tr.setAttribute("id", "insertedTable1" + s);
               tr.innerHTML = '<td>' + jsonObject.firstName[i] + '</td>' +
               '<td>' + jsonObject.lastName[i] + '</td>' +
               '<td>' + jsonObject.email[i] + '</td>' +
               '<td>' + jsonObject.phoneNumber[i] + '</td>';
               table.appendChild(tr);
			   }
         }
      };
   }
   catch(err)
   {
      document.getElementById("contactSearchResult").innerHTML = err.message;
   }
}

function searchContact()
{
   var srch = document.getElementById("searchContact").value;
	document.getElementById("searchContactResult").innerHTML = "";

	var jsonPayload = '{"search" : "' + srch + '", "userId" : "' + userId + '"}';
	var url = urlBase + 'api/SearchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
      xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
			   document.getElementById("searchContactResult").innerHTML = "Contact(s) found";

				var jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error.length > 0)
				{
				   document.getElementById("searchContactResult").innerHTML = "No contacts were found.";
				   return;
				}

            contactId = jsonObject.tableId;

				var i;
				for (i = 0; i < jsonObject.firstName.length; i++)
				{
               var table = document.getElementById('table2');
               var tr = document.createElement("tr");
               s = jsonObject.userId[i];

               tr.setAttribute("id", "insertedTable2" + s);
               tr.innerHTML = '<td>' + jsonObject.firstName[i] + '</td>' +
               '<td>' + jsonObject.lastName[i] + '</td>' +
               '<td>' + jsonObject.email[i] + '</td>' +
               '<td>' + jsonObject.phoneNumber[i] + '</td>' +
               '<td><button type="button" class="button" onclick="deleteContact(' + (s) + ');">Delete</button></td>';

               table.appendChild(tr);
				}
			}
		};
	}
	catch(err)
	{
		document.getElementById("searchContactResult").innerHTML = err.message;
	}
}

function deleteTable()
{
   //document.getElementById("table").remove();
   var mainContactTable = document.getElementById("table");
   mainContactTable.parentNode.removeChild(mainContactTable);
}


function deleteContact(id)
{
//   document.getElementById("contactDeleteResult").innerHTML = "";
   contactId = id;

   var jsonPayload = '{"tableId" : "' + contactId + '", "UserId" : "' + userId + '"}';
	var url = urlBase + 'api/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
      xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
            var searchContactTable = document.getElementById("insertedTable2"+id);
            searchContactTable.parentNode.removeChild(searchContactTable);

            // deleting current row in search contact result table
            //var mainContactTable = document.getElementById("insertedTable1"+id);
            //mainContactTable.parentNode.removeChild(mainContactTable);

            //document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
            //var jsonObject = JSON.parse(xhr.responseText);

            // Deleteing table
            mainContactTable = document.getElementById("table");
            mainContactTable.parentNode.removeChild(mainContactTable);

            var mainContact = document.getElementById("contacts");
            // var table = document.getElementById('gibberish2');
            var table = document.createElement("table");
            // tr.setAttribute("id", "insertedTable2"+s);
            table.setAttribute("class", "contacts");
            table.setAttribute("id", "table");
            table.setAttribute("border", "1");
            table.innerHTML = '<tr>' + '<th>FirstName</th>' + '<th>Last Name</th>' + '<th>E-Mail</th>' + '<th>Phone Number</th>'
            '</tr>';
            mainContact.appendChild(table);

            retrieveContacts();
			}
		};
	}
	catch(err)
	{
		document.getElementById("searchContactResult").innerHTML = err.message;
	}
}
