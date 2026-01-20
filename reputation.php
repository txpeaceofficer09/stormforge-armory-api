<?php

$realm = !empty($_REQUEST['realm']) ? $_REQUEST['realm'] : 'Frostmourne';
$character = !empty($_REQUEST['name']) ? $_REQUEST['name'] : '';

?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/stylesheet.css">

			<h2></h2>
			<div id="playerData" class="mb-5"></div>

			<div class="d-flex justify-content-center mb-4">
				<div class="w-md-75 w-xl-50">
					<div class="input-group">
						<span class="input-group-text">Search</span>
						<input type="text" class="form-control" id="search" placeHolder="Search..." />
					</div>
				</div>
			</div>

			<div class="table-responsive">
				<table class="table table-striped">
					<thead>
						<tr>
							<th>Name</th>
							<th>Standing</th>
							<th>&nbsp;</th>
							<th>Progress</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>

<script src="js/javascript.js"></script>
<script>

$(document).ready(function() {
	getCharacterReputations('<?php echo $realm; ?>', '<?php echo $character; ?>');
});

</script>
