<?php

	$inData = getRequestInfo();

	// 2 - Extract the contact info
  $userID = $inData["userID"];
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
		// Generate SQL code to search the contact in the database
		$sql = "SELECT DISTINCT contacts.first_name, contacts.last_name, contacts.email, contacts.phone FROM contacts
							WHERE contacts.user_id = $userID
							AND (contacts.first_name LIKE '%$keyword%' OR contacts.last_name LIKE '%$keyword%' OR contacts.email LIKE '%$keyword%')
							ORDER BY contacts.first_name ASC;"

  }


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
?>
