<?php

	try{
		$dbh = new PDO("mysql:host=localhost;dbname=000380913", "000380913", "19950516");
	}catch (Exception $e){
		die("Error connecting to database."); //Just aborts the script
	}
	
	$selectCommand = "SELECT * FROM eggClusters";
	
	$stmt = $dbh->query($selectCommand);
	
	$eggClusterRecordsDB = array();
	
	while($row = $stmt->fetch()){
		$eggClusterRecordsDB[] =
			array('longitude' => $row['longitude'],
				  'latitude' => $row['latitude']);
	}
	
	echo json_encode($eggClusterRecordsDB);
?>