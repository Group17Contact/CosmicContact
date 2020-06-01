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
				var jsonObject = JSON.parse(xhr.responseText);
			if (this.status !== 200)
			{
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
				return;
			}

			// Parse the response from the server


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
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] !== "userData" )
			continue;
		var userData = JSON.parse(decodeURIComponent(tokens[1]));
		userId = userData.userId;
		firstName = userData.firstName;
		lastName = userData.lastName;
		break;
	}

	if( userId < 0 )
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
   var cFName = document.getElementById("cFirstName").value;
   var cLName = document.getElementById("cLastName").value;
   var cPhoneNum = document.getElementById("cPhoneNumber").value;
   var cEmail = document.getElementById("cEmail").value;
   document.getElementById("contactAddResult").innerHTML = "";

   // Prepare to send the contact info to the server
   var jsonPayload = '{"cFirstName" : "' + cFName + '", "cLastName" : "' + cLName + '", "cPhoneNum" : "' + cPhoneNum + '", "cEmail" : "' + cEmail + '", "userId" : "' + userId + '"}';
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

            tr.innerHTML = '<td>' + document.getElementById("cFirstName").value + '</td>' +
            '<td>' + document.getElementById("cLastName").value + '</td>' +
            '<td>' + document.getElementById("cEmail").value + '</td>' +
            '<td>' + document.getElementById("cPhoneNumber").value + '</td>';
            table.appendChild(tr);

            // Clear the add contact fields
            document.getElementById("cEmail").value = "";
            document.getElementById("cFirstName").value = "";
            document.getElementById("cLastName").value = "";
            document.getElementById("cPhoneNumber").value = "";
            document.getElementById("contactAddResult").innerHTML = "Contact has been added";
            // deleteTable();
            // retrieveContacts();
			}
		};
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
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
				   document.getElementById("contactSearchResult").innerHTML = "No contacts were found.";
				   return;
			   }

            var i;
            for (i = 0; i < jsonObject.firstName.length; i++)
				{
               var table = document.getElementById('gibberish');
               var tr = document.createElement("tr");
               s = jsonObject.userId[i];

               tr.setAttribute("id", "insertedTable1"+s);
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
	document.getElementById("contactSearchResult").innerHTML = "";

	var jsonPayload = '{"search" : "' + srch + '", "userId" : "' + userId + '"}';
	var url = urlBase + 'api/SearchContacts.' + extension;

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
			   document.getElementById("contactSearchResult").innerHTML = "Contact(s) found";

				var jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error.length > 0)
				{
				   document.getElementById("contactSearchResult").innerHTML = "No contacts were found.";
				   return;
				}

            contactId = jsonObject.tableId;

				var i;
				for (i = 0; i < jsonObject.firstName.length; i++)
				{
               var table = document.getElementById('gibberish2');
               var tr = document.createElement("tr");
               s = jsonObject.userId[i];

               tr.setAttribute("id", "insertedTable2"+s);
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
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function deleteTable()
{
   //document.getElementById("gibberish").remove();
   var mainContactTable = document.getElementById("gibberish");
   mainContactTable.parentNode.removeChild(mainContactTable);
}


function deleteContact(id)
{
//   document.getElementById("contactDeleteResult").innerHTML = "";
   contactId = id;

   var jsonPayload = '{"tableId" : "' + contactId + '", "UserId" : "' + userId + '"}';
	var url = urlBase + 'api/deleteContact.' + extension;

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
            mainContactTable = document.getElementById("gibberish");
            mainContactTable.parentNode.removeChild(mainContactTable);

            var mainContact = document.getElementById("contacts");
            // var table = document.getElementById('gibberish2');
            var table = document.createElement("table");
            // tr.setAttribute("id", "insertedTable2"+s);
            table.setAttribute("class", "contacts");
            table.setAttribute("id", "gibberish");
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
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function addColor()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddColor.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}

}

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	var colorList = "";

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchColors.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}
