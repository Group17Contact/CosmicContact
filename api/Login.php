<?php
	// This is required at the start to use sessions
	session_start();

	// TODO: Move these to a config file
	const MAX_USERNAME_LENGTH = 50;
	const USER_SESSION_KEY = "userId";

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

	// Get the username/password out of the JSON object. If they're missing, use NULL
	$rawPass = $inData["password"] ?? NULL;
	$username = $inData["username"] ?? NULL;

	// Check that the username/password are present and valid
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

	// Connect to the MySQL server. (host, username, password, database)
	// TODO: Move the database info to a config file
	$conn = new mysqli("localhost", "nas", "sx1qJa3kO8A#", "cosmiccontact");

	// Check for errors connecting to the MySQL database
	if ($conn->connect_error) {
		echoErrorJson("Database error");
		http_response_code(503);
		return;
	}

	// Set up a query. We will substitute a username in place of the "?"
	$stmt = $conn->prepare("select user_id, password from Users where login=?");
	// Check for errors
	if (!$stmt) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}

	// The "s" specifies that we're substituting in a string
	$stmt->bind_param("s", $username);
	// Execute the query
	$ok = $stmt->execute();

	// Check for errors
	if (!$ok) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}
	// Get the results
	$result = $stmt->get_result();
	// Check if there is no matching username (or if somehow there are duplicate user accounts)
	if ($result->num_rows != 1) {
		errorBadLogin();
		return;
	}
	// Fetch our single result (the matching user)
	$row = $result->fetch_assoc();
	// Free/close some database resources.
	// This isn't strictly required (see https://www.php.net/manual/en/function.mysql-close.php)
	$stmt->close();
	$conn->close();

	// Read in the password hash from the database
	$passwordHash = $row["password"] ?? NULL;

	// Check if the user has entered the correct password
	$match = password_verify($rawPass, $passwordHash);

	// If the password is incorrect, deny the login
	if (!$match) {
		errorBadLogin();
		return;
	}
	// Associate the user ID with the session
	$userId = $row["user_id"] ?? NULL;
	$_SESSION[USER_SESSION_KEY] = $userId;

	// Return some basic info as JSON
	echo json_encode(["success" => true, "userId" => $userId]);


	// This function was provided by Rick Leinecker
	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}
	function errorBadLogin() {
		http_response_code(403);
		echo json_encode(["success" => false, "error" => "Invalid username or password"]);
	}
	// Checks that the username is a nonempty string within the character limit,
	// and contains only letters, numbers, underscores, and dashes
	function validateUsername($username) {
		return is_string($username) && strlen($username) <= MAX_USERNAME_LENGTH && preg_match("/^[A-z0-9_-]+$/", $username);
	}

	function echoErrorJson($error) {
		echo json_encode(["error" => $error]);
	}
?>
