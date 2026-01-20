<?php

$img = !empty($_REQUEST['img']) ? $_REQUEST['img'] : '';

if ( !empty($img) ) {
	if ( !file_exists("images/{$img}") ) {
		if ( $fp=fopen("images/{$img}", 'w') ) {
			fputs($fp, join('', file("https://logs.stormforge.gg/images/guild-crest/{$img}")));
			fclose($fp);
		}
	}
}

header("Content-Type: image/png");
echo file_get_contents("images/{$img}");

?>
