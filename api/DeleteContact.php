<?php
    // 1 - Request Info
    $inData = getRequestInfo();

    // 2 - Extract the contact info
    $userID = $inData["userId"];
    $firstname = $inData["firstname"];
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
        // Generate SQL code to delete the contact from the database
        $sql = "DELETE FROM Contacts 
                WHERE first_name = '" . $firstname . "' AND last_name = '" . $lastname . "' AND email = '" . $email . "' AND phone = '" . $phone . "' AND user_Id = " . $userID . "";
                        
    }

    // 5 -Check if contact was deleted
    // Contact was not deleted, send an error
    if ($conn->query($sql) != TRUE)
    {
        header('Content-type: application/json');
        echo '{"Error Message":"' . $conn->error . '"}';
        $conn->close();
    }
    // Contact was deleted successfully 
    else
    {
        header('Content-type: application/json');
        echo '{"Message":  "'. $firstname .'  '.$lastname . ' was successfully deleted!!"}';
        $conn->close();
    }

    // Request the info
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
?>