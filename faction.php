<?php

$name = !empty($_REQUEST['name']) ? $_REQUEST['name'] : '';

if ( !empty($name) ) {
	if ( !file_exists("img/{$name}.png") ) {
		if ( $fp=fopen("img/{$name}.png", 'w') ) {
			fputs($fp, join('', file("https://wow.zamimg.com/images/icons/{$name}.png")));
			fclose($fp);
		}
	}
}

header("Content-Type: image/png");
echo file_get_contents("img/{$name}.png");

?>
