# stormforge-armory-api
Example using stormforge armory API.

### Disclaimer:

> I am not in any way employed by or associated with StormForge (other than being a player on their servers). This code is not endorsed or reviewed by staff from StormForge and has received no endorsement from any of their staff. This is simply an example of using the API provided by them. If you have issues with the API, reach out to StormForge.  If you have issues with the code in this repo, you can report those here on GitHub. The StormForge staff will not provide you with any sort of help with this third-party code.


To start, you'll need to visit the stormforge site and login and go [here](https://stormforge.gg/en/account#apikey).

Get your **secret** and **API key** and put them in the api.php file.

```
$secret = 'SECRET';
$apiKey = 'KEY';
```

The **crest.php**, **image.php**, **faction.php** and **race.php** are used to retrieve images.  The first time an image is requested, it is pulled from an internet source and stored in the images folder.  Subsequent requests for the same image will use the locally stored version.

The other PHP files are the layouts for the pages and do an AJAX request to the **api.php** to retrieve information from the StormForge API.

**guild.php** requests a roster for the guild.  Accepts two parameters: **guild.php?realm=Frostmourne&guild=Oceanica**, but these can be omitted if you set their values in the file.
**reputation.php** requests the list of reputations for a character.  Accepts two parameters: **reputation.php?realm=Frostmourne&name=Soonbesteak**, but these also can be omitted by setting them in the file.

I will add more files and more data as I build out the files.

You can read more about the API used by StormForge [here](https://tauriwow.com/apidocs).  You will need an account with Tauri WoW to read the documentation.

**NOTE:** Not all of the API is fully developed or functioning on StormForge and some data is not returned with the API.  Some data is also only returned if the API secret and key used are for an account that has a character in the guild. For example, you can not get the GMOTD from a guild that you do not have any characters in. The solution for this is to associate guild names with sets of credentials (API secret/key) and use the set of credentials that match the guild you are trying to retrieve information for.  In my own implementation of this, I used a MySQL server and stored the data in a table (`guildName`, `secret`, `apiKey`).

```
<?php

$mysqli = new mysqli('localhost', 'USERNAME', 'PASSWORD', 'DATABASE') or die("MySQL: Could not connect.");

$mysqli->query("CREATE TABLE IF NOT EXISTS `apiCredentials` ( `guildName` VARCHAR(64) UNIQUE , `secret` VARCHAR(64) NOT NULL DEFAULT '' , `apiKey` VARCHAR(64) NOT NULL DEFAULT '' );");

$guildName = !empty($_REQUEST['params']['gn']) ? $_REQUEST['params']['gn'] : 'Oceanica';

$result = $mysqli->query("SELECT `secret`, `apiKey` FROM `apiCredentials` WHERE `guildName` LIKE '{$guildName}' LIMIT 1;");
if ( $result->num_rows == 1 ) {
  $credentials = $result->fetch_assoc();
  $secret = $credentials['secret'];
  $apiKey = $credentials['apiKey'];
}

$mysqli->close();

?>
```

This will:
* connect to the database.
* create the table, if it doesn't exist.
* get the guild name (gn) from the parameter passed to the script or default it to the guild you specify.
* retrieve and set the `secret` and `apiKey` to use in the subsequent API call.
* close the connection to the DB because we are done with it.

If someone looks up a guild that is not in your database, the query to the API will still succeed with your defaulted guild credentials specified, but if you don't have a character in that guild on that account, you won't see certain information that is only available to members of the guild.  You can remedy this by creating an account/character to join that guild.
