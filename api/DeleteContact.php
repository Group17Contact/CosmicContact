<?php
    // 1 - Request Info
    $inData = getRequestInfo();

    // 2 - Extract the contact info
    $userID = $inData["userId"];
    $contactId = $inData["contactId"];

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
                WHERE id = " . $contactId . "  AND user_id = " . $userID . "";             
    }

    // 5 -Check if contact was deleted
    // Contact was deleted successfully 
    if ($conn->query($sql) == TRUE && $conn->affected_rows > 0)
    {
        header('Content-type: application/json');
        echo '{"Message":  "'. $firstname .'  '.$lastname . ' was successfully deleted!!"}';
        $conn->close();
    }
    // Contact was not deleted, send an error
    else
    {
        header('Content-type: application/json');
        echo '{"Message":  "'. $firstname .'  '.$lastname . ' does not exist in your contact list"}';
        $conn->close();
    }

    // Request the info
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
?>