<?php

$img = !empty($_REQUEST['img']) ? $_REQUEST['img'] : '';

if ( !empty($img) ) {
	if ( !file_exists("images/{$img}") ) {
		if ( $fp=fopen("images/{$img}", 'w') ) {
			fputs($fp, file_get_contents("https://wow.zamimg.com/images/wow/icons/small/{$img}"));
			fclose($fp);
		}
	}
}

header("Content-Type: image/jpg");
echo file_get_contents("images/{$img}");

?>
