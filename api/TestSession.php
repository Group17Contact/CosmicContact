<?php
	session_start();
	const USER_SESSION_KEY = "userId";
	echo "Your user ID is " . $_SESSION[USER_SESSION_KEY];
?>