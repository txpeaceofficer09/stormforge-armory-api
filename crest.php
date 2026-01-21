<?php

$img = !empty($_REQUEST['img']) ? $_REQUEST['img'] : '';

if ( !is_dir("images") ) mkdir("images", 755);

if ( !empty($img) ) {
	if ( !preg_match('/\.png$/i', $img) ) $img .= '.png';

	if ( !file_exists("images/{$img}") ) {
		if ( $fp=fopen("images/{$img}", 'w') ) {
			fputs($fp, file_get_contents("https://logs.stormforge.gg/images/guild-crest/{$img}"));
			fclose($fp);
		}
	}
}

header("Content-Type: image/png");
echo file_get_contents("images/{$img}");

?>
