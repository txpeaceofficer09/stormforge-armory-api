<?php

$name = !empty($_REQUEST['name']) ? $_REQUEST['name'] : '';
if ( preg_match("/\.png$/i", $name) ) $name = substr($name, 0, stripos($name, "."));
$src = "https://static.tauri.hu/images/icons/large/{$name}.png";
$filename = "images/{$name}.png";

if ( !is_dir("images/") ) mkdir("images/", 0755);

if ( !empty($name) && !file_exists($filename) ) {
	if ( $fp=fopen($filename, 'w') ) {
		fputs($fp, file_get_contents($src));
		fclose($fp);
	}
}

if ( file_exists($filename) ) {
	header("Content-Type: image/png");
	echo file_get_contents($filename);
}

?>
