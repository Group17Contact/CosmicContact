<?php
	// This is required at the start to use sessions
	session_start();
	// TODO: Move these to a config file
	const MAX_USERNAME_LENGTH = 50;
	const USER_SESSION_KEY = "userId";

	// This is the error code we'll receive if there is an existing account with the same username
	const MYSQL_ERR_DUPE_ENTRY = 1062;

	// Check for incorrect Content-Type. AFAIK, this isn't a proper substitute for CSRF protection, but it helps
	$contentType = $_SERVER["CONTENT_TYPE"] ?? NULL;
	if ($contentType != "application/json") {
		echoErrorJson("Content-Type must be application/json");
		http_response_code(415);
		return;
	}
	// Read in the JSON payload sent by the client
	$inData = getRequestInfo();

	// Check if the JSON is missing or invalid
	if (!isset($inData)) {
		echoErrorJson("Missing JSON");
		http_response_code(400);
		return;
	}
	// Get the account info out of the JSON object. If they're missing, use NULL
	$rawPass = $inData["password"] ?? NULL;
	$username = $inData["username"] ?? NULL;
	$firstName = $inData["firstName"] ?? NULL;
	$lastName = $inData["lastName"] ?? NULL;

	// Check for the presence of the username, password, first name, and last name
	if (!is_string($rawPass)) {
		echoErrorJson("Missing/invalid password");
		http_response_code(400);
		return;
	}
	if (!validateUsername($username)) {
		echoErrorJson("Missing/invalid username");
		http_response_code(400);
		return;
	}
	if (!is_string($firstName) || strlen($firstName) > MAX_USERNAME_LENGTH) {
		echoErrorJson("Missing/invalid first name");
		http_response_code(400);
		return;
	}
	if (!is_string($lastName) || strlen($lastName) > MAX_USERNAME_LENGTH) {
		echoErrorJson("Missing/invalid last name");
		http_response_code(400);
		return;
	}

	// Compute a password hash
	$passwordHash = password_hash($rawPass, PASSWORD_BCRYPT);

	// Connect to the MySQL server. (host, username, password, database)
	// TODO: Move the database info to a config file
	$conn = new mysqli("localhost", "nas", "sx1qJa3kO8A#", "cosmiccontact");

	// Check for errors connecting to the MySQL database
	if ($conn->connect_error) {
		echoErrorJson("Database error");
		http_response_code(503);
		return;
	} 

	// Set up an INSERT statement. We will substitute the input values in place of each "?"
	$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, login, password) VALUES (?, ?, ?, ?)");
	// Check for errors
	if (!$stmt) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}
	// The "s" specifies that we're substituting in a string
	// Here we're substituting in 4 strings, which we list in order
	$stmt->bind_param("ssss", $firstName, $lastName, $username, $passwordHash);
	// Execute the INSERT
	$ok = $stmt->execute();

	// Check if the insert failed because the username is not unique
	if ($stmt->errno == MYSQL_ERR_DUPE_ENTRY) {
		echoErrorJson("An account with that username already exists");
		http_response_code(403);
		return;
	}

	// Check for other errors
	if (!$ok) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}
	// Get the user ID for the account we just created
	$userId = $conn->insert_id;
	// Free/close some database resources.
	// This isn't strictly required (see https://www.php.net/manual/en/function.mysql-close.php)
	$stmt->close();
	$conn->close();

	// Associate the user ID with the session (automatically log them in)
	$_SESSION[USER_SESSION_KEY] = $userId;
	// Return some basic info as JSON
	echo json_encode(["userId" => $userId]);

	// This function was provided by Rick Leinecker
	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	// Checks that the username is a nonempty string within the character limit
	// and contains only letters, numbers, underscores, and dashes
	function validateUsername($username) {
		return is_string($username) && strlen($username) <= MAX_USERNAME_LENGTH && preg_match("/^[A-z0-9_-]+$/", $username);
	}

	function echoErrorJson($error) {
		echo json_encode(["error" => $error]);
	}
?>
