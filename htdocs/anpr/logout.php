<?php
session_start();
session_unset();
session_destroy();
header('HTTP/1.0 401 Unauthorized');
echo 'Logout eseguito. Chiudere la finestra per completare il logout.';
exit;
?>
