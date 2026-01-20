<?php

$params = $_REQUEST['params'] ?? [];
$targetUrl = $_REQUEST['url'] ?? '';

$secret = "SECRET";
$apiKey = "KEY";

$request = [
	'secret' => $secret,
	'url' => $targetUrl,
	'params' => $params
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://characters-api.stormforge.gg/v1/?apikey={$apiKey}");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, urlencode(json_encode($request, true)));

curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'User-Agent: PHP-cURL-App']);

$response = curl_exec($ch);
header("Content-Type: application/json");
echo $response;

?>
