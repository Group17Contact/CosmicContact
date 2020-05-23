<?php
	session_start();
	// Delete the cookie
	$params = session_get_cookie_params();
	setcookie(session_name(), '', 0, $params['path'], $params['domain'], $params['secure'], isset($params['httponly']));
	
	// Delete the associated session data
	session_destroy();
	
	// Response
	echo "{}";
?>