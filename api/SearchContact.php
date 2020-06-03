<?php

    // 1 - Request Info 
	$inData = getRequestInfo();

	// 2 - Extract the contact info
	$searchResults = "";
	$searchCount = 0;
	$userID = $inData["userId"];
	$keyword = $inData["keyword"];

	// 3 - Create a connection to the database (localhost, username, password, database name)
 	$conn = new mysqli("localhost", "nas", "sx1qJa3kO8A#", "cosmiccontact");

	// 4 - Check Connection
  	// Connection Failed
  	if ($conn->connect_error)
  	{
		header('Content-type: application/json');
		echo '{"error":"' . $conn->connect_error . '"}';
  	}
  	// Connection is successful
  	else
  	{
		// 5 - Generate SQL code to search the contact in the database
		$sql = "SELECT id, first_name, last_name, email, phone, date
				FROM Contacts
				WHERE user_id = " . $userID . "
				AND (first_name LIKE '%" . $keyword . "%' OR last_name LIKE '%" . $keyword . "%' OR email LIKE '%" . $keyword . "%' OR phone LIKE '%" . $keyword . "%')
				ORDER BY first_name ASC";
		// Get the result of the search
		$result = $conn->query($sql);
		// 6 - Process the result
		// Records found
		if ($result->num_rows > 0)
		{
			$contacts = [];
			while($row = $result->fetch_assoc())
			{
				array_push($contacts, [
					'firstName' => $row['first_name'],
					'lastName' => $row['last_name'],
					'email' => $row['email'],
					'phone' => $row['phone'],
					'contactId' => $row['id']
					]);
			}
			// Convert the array to JSON string
			$contactsJSON = json_encode($contacts);

			header('Content-type: application/json');
			echo '{"results":' . $contactsJSON . '}';
			$conn->close();
			
		}
		// No Records found
		else
		{
			header('Content-type: application/json');
			echo '{"Message":"No Records Found"}';
			$conn->close();
		}
	}


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
?>
