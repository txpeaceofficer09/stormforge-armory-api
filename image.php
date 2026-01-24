<?php

$name = !empty($_REQUEST['name']) ? $_REQUEST['name'] : 'inv_misc_questionmark';

if ( preg_match('/\.png/i', $name) ) {
	$src = "https://static.tauri.hu/images/icons/large/{$name}";
	$filename = "images/{$name}";
} else {
	$src = "https://static.tauri.hu/images/icons/large/{$name}.png";
	$filename = "images/{$name}.png";
}

if ( !is_dir("images/") ) mkdir("images/", 0755);

if ( !empty($name) && !file_exists($filename) ) {
	$data = file_get_contents($src);
	if ( strlen($data) > 0 && $fp=fopen($filename, 'w') ) {
		fputs($fp, $data);
		fclose($fp);
	}
}

if ( file_exists($filename) ) {
	header("Content-Type: image/png");
	echo file_get_contents($filename);
} else {
	header("Location: image.php?name=inv_misc_questionmark");
}

?>
