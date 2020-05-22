<?php
	session_start();
	const MAX_USERNAME_LENGTH = 50;
	const USER_SESSION_KEY = "userId";
	const MYSQL_ERR_DUPE_ENTRY = 1062;
	$contentType = $_SERVER["CONTENT_TYPE"] ?? NULL;
	if ($contentType != "application/json") {
		echoErrorJson("Content-Type must be application/json");
		http_response_code(415);
		return;
	}
	$inData = getRequestInfo();
	
	if (!isset($inData)) {
		echoErrorJson("Missing JSON");
		http_response_code(400);
		return;
	}
	$rawPass = $inData["password"] ?? NULL;
	$username = $inData["username"] ?? NULL;
	$firstName = $inData["firstName"] ?? NULL;
	$lastName = $inData["lastName"] ?? NULL;
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
	
	$conn = new mysqli("localhost", "cosmiccontact", "<password>", "cosmiccontact");
	if ($conn->connect_error) 
	{
		echoErrorJson("Database error");
		http_response_code(503);
		return;
	} 

	$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, login, password) VALUES (?, ?, ?, ?)");
	if (!$stmt) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}
	$passwordHash = password_hash($rawPass, PASSWORD_BCRYPT);
	$stmt->bind_param("ssss", $firstName, $lastName, $username, $passwordHash);
	$ok = $stmt->execute();
	if ($stmt->errno == MYSQL_ERR_DUPE_ENTRY) {
		echoErrorJson("An account with that username already exists");
		http_response_code(403);
	}
	if (!$ok) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}
	$stmt->close;
	$userId = $conn->insert_id;
	echo json_encode(["userId" => $userId]);
	$_SESSION[USER_SESSION_KEY] = $userId;
	$conn->close();

	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	function errorBadLogin() {
		http_response_code(401);
		echo json_encode(["success" => false, "error" => "Invalid username or password"]);
	}
	function validateUsername($username) {
		return is_string($username) && strlen($username) <= MAX_USERNAME_LENGTH && preg_match("/^[A-z0-9_-]+$/", $username);
	}
	
	function echoErrorJson($error) {
		echo json_encode(["error" => $error]);
	}
?>
