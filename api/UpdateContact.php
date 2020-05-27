<?php

	$inData = getRequestInfo();

	// 2 - Extract the contact info
  $userID = $inData["userID"];
	$firstname = $inData["firstame"];
	$lastname = $inData["lastname"];
	$email = $inData["email"];
	$phone = $inData["phone"];

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
		$sql1 = "UPDATE Contacts SET Contacts.first_name = $firstname WHERE Contacts.first_name <> $firstname;"
		$sql2 = "UPDATE Contacts SET Contacts.last_name = $lastname WHERE Contacts.last_name <> $lastname;"
		$sql3 = "UPDATE Contacts SET Contacts.email = $email WHERE Contacts.email <> $email;"
		$sql4 = "UPDATE Contacts SET Contacts.phone = $phone WHERE Contacts.phone <> $phone;"

  }


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
?>
