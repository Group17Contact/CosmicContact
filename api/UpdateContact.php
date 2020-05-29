<?php
        // 1 - Request Info
        $inData = getRequestInfo();

        // 2 - Extract the contact info
        $userID = $inData["userId"];
        $firstname = $inData["firstname"];
        $lastname = $inData["lastname"];
        $email = $inData["email"];
        $phone = $inData["phone"];
        $firstnamenew = $inData["firstnamenew"];
        $lastnamenew = $inData["lastnamenew"];
        $emailnew = $inData["emailnew"];
        $phonenew = $inData["phonenew"];

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
          // Checking if the contact exists before we attempt to update it.
						$sql = "SELECT *
                FROM Contacts
                WHERE user_id = " . $userID . "
                AND first_name = '" . $firstname . "' AND last_name = '" . $lastname . "' AND email = '" . $email . "' AND phone = '" . $phone . "' ";

						$result = $conn->query($sql);

						if ($result->num_rows == 0)
						{
							 header('Content-type: application/json');
							 echo '{"Message":  "'. $firstname .'  '.$lastname . ' does not exist in your list"}';
							 $conn->close();
							 return;
						}
            // If it exists, we create the SQL code to update it.
						else
						{
							$sql = "UPDATE Contacts
							SET first_name = '" . $firstnamenew . "' , last_name = '" . $lastnamenew . "' , email = '" . $emailnew . "' , phone = '" . $phonenew . "'
							WHERE first_name = '" . $firstname . "' AND last_name = '" . $lastname . "' AND email = '" . $email . "' AND phone = '" . $phone . "' AND user_Id = " . $userID . "";
						}
        }

// 5 -Check if contact was updated
    // Contact was not updated, send an error
    if ($conn->query($sql) != TRUE)
    {
        header('Content-type: application/json');
        echo '{"Error Message":"' . $conn->error . '"}';
        $conn->close();
    }
    // Contact was updated successfully
    else
    {
        header('Content-type: application/json');
        echo '{"Message":  "'. $firstname .'  '.$lastname . ' was successfully updated to '. $firstnamenew .' '.$lastnamenew.'!!"}';
        $conn->close();
    }

    // Request the info
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

?>
