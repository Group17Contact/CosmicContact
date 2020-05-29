<?php
    // 1 - Request Info
    $inData = getRequestInfo();

    // 2 - Extract the contact info
    $userID = $inData["userId"];
    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $date = date("Y/m/d");

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
        // Check of contact is already on the list
        $sql = "SELECT *
                FROM Contacts
                WHERE user_id = " . $userID . "
                AND first_name = '" . $firstname . "' AND last_name = '" . $lastname . "' AND email = '" . $email . "' AND phone = '" . $phone . "' ";

        // Get the result of the search
        $result = $conn->query($sql);
        // Process the result
        // Records found
        if ($result->num_rows > 0)
        {
            header('Content-type: application/json');
            echo '{"Message":  "'. $firstname .'  '.$lastname . ' already exists in your list"}';
            $conn->close();
            return;
        }
        // No records found, add the contact
        else
        {
            // Generate SQL code to add the contact to the database
            $sql = "INSERT INTO Contacts(first_name, last_name, email, phone, user_id, date)
                    VALUES ('" . $firstname . "', '" . $lastname . "', '" . $email . "', '" . $phone . "', '" . $userID . "', '" . $date . "')";
        }

    }

    // 5 -Check if contact was added
    // Contact was not added, send an error
    if ($conn->query($sql) != TRUE)
    {
        header('Content-type: application/json');
        echo '{"Error Message":"' . $conn->error . '"}';
        $conn->close();
    }
    // Contact was added successfully
    else
    {
        header('Content-type: application/json');
        echo '{"Message":  "'. $firstname .'  '.$lastname . ' was successfully added on ' . $date . '!!"}';
        $conn->close();
    }

    // Request the info
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

?>
