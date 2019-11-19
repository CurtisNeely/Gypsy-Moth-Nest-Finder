<?php

	try{
		$dbh = new PDO("mysql:host=localhost;dbname=000380913", "000380913", "19950516");
	}catch (Exception $e){
		die("Error connecting to database."); //Just aborts the script
	}
	
	$tree = $_REQUEST['tree'];
	$road = $_REQUEST['road'];
	$lat = $_REQUEST['lat'];
	$long = $_REQUEST['long'];
	
	
	$selectCommand = "INSERT INTO eggClusters (tree, road, longitude, latitude) VALUES ('$tree', '$road','$lat', '$long')";
	
	$stmt = $dbh->prepare($selectCommand);
	$stmt->execute();
	
	echo "HELLO MAJOR TOM!";

?>