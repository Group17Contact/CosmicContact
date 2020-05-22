<?php
	session_start();
	const MAX_USERNAME_LENGTH = 50;
	const USER_SESSION_KEY = "userId";
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
	
	$conn = new mysqli("localhost", "cosmiccontact", "<password>", "cosmiccontact");
	if ($conn->connect_error) 
	{
		echoErrorJson("Database error");
		http_response_code(503);
		return;
	} 

	$stmt = $conn->prepare("select user_id, password from Users where login=?");
	if (!$stmt) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}
	
	$stmt->bind_param("s", $username);
	$ok = $stmt->execute();
	if (!$ok) {
		echoErrorJson("Server error");
		http_response_code(500);
		return;
	}
	$result = $stmt->get_result();
	if ($result->num_rows != 1) {
		errorBadLogin();
		return;
	}
	$result = $result->fetch_assoc();
	$stmt->close;
	$conn->close();

	$password = $result["password"] ?? NULL;

	$match = password_verify($rawPass, $password);
	$userId = $result["user_id"] ?? NULL;
	if (!$match) {
		errorBadLogin();
		return;
	}
	$_SESSION[USER_SESSION_KEY] = $userId;
	echo json_encode(["success" => true, "userId" => $userId]);

	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	function errorBadLogin() {
		http_response_code(403);
		echo json_encode(["success" => false, "error" => "Invalid username or password"]);
	}
	function validateUsername($username) {
		return is_string($username) && strlen($username) <= MAX_USERNAME_LENGTH && preg_match("/^[A-z0-9_-]+$/", $username);
	}
	
	function echoErrorJson($error) {
		echo json_encode(["error" => $error]);
	}
?>
