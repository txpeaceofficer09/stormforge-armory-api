<?php

$name = !empty($_REQUEST['name']) ? $_REQUEST['name'] : '';

if ( !empty($name) ) {
	if ( !file_exists("images/{$name}.png") ) {
		if ( $fp=fopen("images/{$name}.png", 'w') ) {
			fputs($fp, file_get_contents("https://wow.zamimg.com/images/icons/{$name}.png"));
			fclose($fp);
		}
	}
}

header("Content-Type: image/png");
echo file_get_contents("images/{$name}.png");

?>
