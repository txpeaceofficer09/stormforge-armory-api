<?php

$img = !empty($_REQUEST['img']) ? $_REQUEST['img'] : '';

if ( !empty($img) ) {
	if ( !file_exists("img/{$img}") ) {
		if ( $fp=fopen($img, 'w') ) {
			fputs($fp, join('', file("https://logs.stormforge.gg/images/guild-crest/{$img}")));
			fclose($fp);
		}
	}
}

header("Content-Type: image/png");
echo file_get_contents("img/{$img}");

?>
