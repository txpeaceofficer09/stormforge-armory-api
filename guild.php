<?php

$realm = !empty($_REQUEST['realm']) ? $_REQUEST['realm'] : 'Frostmourne';
$guild = !empty($_REQUEST['guild']) ? $_REQUEST['guild'] : 'Oceanica';

?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/stylesheet.css">

			<div class="d-flex mb-5">
				<canvas id="guild-emblem" width="124" height="124"></canvas>
				<div>
					<h2 id="guildName"></h2>
					<div id="members"></div>
					<div id="money"></div>
					<div id="gmotd"></div>
					<div id="ginfo"></div>
				</div>
			</div>

			<div class="d-flex justify-content-center mb-4">
				<div class="w-md-75 w-xl-50">
					<div class="input-group">
						<span class="input-group-text">Search</span>
						<input type="text" class="form-control" id="search" placeHolder="Search..." />
					</div>
					<div class="text-secondary">Search name, class, spec, profession, gender, race, rank, etc.</div>
					<div class="text-secondary">Sort by labeled columns.</div>
				</div>
			</div>

			<ul id="classList" class="nav"></ul>

			<div class="table-responsive">
				<table class="table table-striped">
					<thead>
						<tr>
							<th>&nbsp;</th>
							<th>&nbsp;</th>
							<th>&nbsp;</th>
							<th title="Character Name">Name <span>↕</span></th>
							<th title="Character Level">Level <span>↕</span></th>
							<th title="Average Item Level">iLvl <span>↕</span></th>
							<th title="Gear Score">GS <span>↕</span></th>
							<th title="Talent Builds">Talents <span>↕</span></th>
							<th title="Honorable Kills">HK <span>↕</span></th>
							<th title="Primary Professions">&nbsp;</th>
							<th title="Guild Rank">Rank <span>↕</span></th>
							<th title="Achievement Points">Points <span>↕</span></th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>

			<div class="overlay position-fixed top-0 start-0 w-100 h-100 justify-content-center align-items-center d-none"><div class="content-box"><span class="loader me-2"></span>Loading...</div></div>

<script src="js/javascript.js"></script>
<script>

$(document).ready(function() {
	getGuildData('<?php echo $realm; ?>', '<?php echo $guild; ?>');
	getGuildMoney('<?php echo $realm; ?>', '<?php echo $guild; ?>');
});

</script>
