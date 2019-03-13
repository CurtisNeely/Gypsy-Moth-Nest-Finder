var map;
var eggData;
		
function loadMap(){
	
	map = new Microsoft.Maps.Map(document.getElementById('mothMap'), {
		center: new Microsoft.Maps.Location(43.2665, -79.9569)
	});

	loadMothPins('all');
}

function loadMothPins(filter){
	
	clearMap();
	
	if(filter == 'all'){
		loadUserReportedPins();
		loadSeverePins();
		loadModeratePins();
		loadLowpins();
		
	}else if( filter == 'severe'){
		loadSeverePins();
		
	}else if( filter == 'moderate'){
		loadModeratePins();
		
	}else if( filter == 'low'){
		loadLowpins();
		
	}else if( filter == 'userReported'){
		loadUserReportedPins();
	}
			
}

function loadSeverePins(){
	
	for( var x = 0; x < eggData.length; x++ ){
		if(eggData[x].EGGMASS_PER_HA > 10000){
			var location = new Microsoft.Maps.Location(eggData[x].LATITUDE, eggData[x].LONGITUDE);
			
			var pin = new Microsoft.Maps.Pushpin(location, {
				icon: 'images/pinRed.png'
			});

			map.entities.push(pin);
		}
	}
}

function loadModeratePins(){
	for( var x = 0; x < eggData.length; x++ ){
		if(eggData[x].EGGMASS_PER_HA > 1000 && eggData[x].EGGMASS_PER_HA < 10000){
			var location = new Microsoft.Maps.Location(eggData[x].LATITUDE, eggData[x].LONGITUDE);
			
			var pin = new Microsoft.Maps.Pushpin(location, {
				icon: 'images/pinOrange.png'
			});

			map.entities.push(pin);
		}
	}
}

function loadLowpins(){
	for( var x = 0; x < eggData.length; x++ ){
		if(eggData[x].EGGMASS_PER_HA < 1000){
			var location = new Microsoft.Maps.Location(eggData[x].LATITUDE, eggData[x].LONGITUDE);
			
			var pin = new Microsoft.Maps.Pushpin(location, {
				icon: 'images/pinGreen.png'
			});

			map.entities.push(pin);
		}
	}
}

function loadUserReportedPins(){
	
	console.log("loadUserReportedPins!");
	
	$(document).ready(function()
	{
		$.post("php/getEggCluster.php",
		{
			
		}, function(data){
			
			console.log(data);
			
			var eggClusterRecords = JSON.parse(data);
			
			console.log(eggClusterRecords);
	
			for( var x = 0; x < eggClusterRecords.length; x++ ){
				var location = new Microsoft.Maps.Location(eggClusterRecords[x]['longitude'], eggClusterRecords[x]['latitude']);

				var pin = new Microsoft.Maps.Pushpin(location, {
				icon: 'images/pinBlue.png'
				});
				
				map.entities.push(pin);
			}
			
		});
	});	
}

function clearMap(){
	for (var i = map.entities.getLength() - 1; i >= 0; i--){
		var pushpin = map.entities.get(i);
		
		if (pushpin instanceof Microsoft.Maps.Pushpin) 
			map.entities.removeAt(i);
	}
}

function getGeoLocationThenReport(){
	console.log("getGeo");

	var userTree = document.getElementById("userTreeType").value;
	var userRoad = document.getElementById("userClosestRoad").value;

	navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError);
	
	function geoLocationSuccess(position){
		console.log("yes!");
		var loc = new Microsoft.Maps.Location(position.coords.latitude,position.coords.longitude);
		
		var userLat = loc.latitude;
		var userLong = loc.longitude;
		
		reportEggCluster(userTree, userRoad, userLat, userLong);
	}
	
	function geoLocationError(error){
		switch(error.code) {
			case error.PERMISSION_DENIED:
				console.log("User denied the request for Geolocation. Default values used");
				break;
			case error.POSITION_UNAVAILABLE:
				console.log( "Location information is unavailable. Default values used");
				break;
			case error.TIMEOUT:
				console.log("The request to get user location timed out. Default values used");
				break;
			case error.UNKNOWN_ERROR:
				console.log("An unknown error occurred. Default values used");
				break;
		}
	}
}

function reportEggCluster(userTree, userRoad, userLat, userLong){
	console.log(userLat);
	console.log(userLong);
	
	$tree = userTree;
	$road = userRoad;
	$lat = userLat;
	$long = userLong;
	
	$(document).ready(function()
	{
		$.post("php/reportEggCluster.php",
		{
			"tree":$tree,
			"road":$road,
			"lat": $lat,
			"long":$long
		}, function(data){
			console.log(data);
		});
	});
}

eggData = 
[
  {
    "EGGMASS_PER_HA": 550,
    "LONGITUDE": -79.97752059,
    "LATITUDE": 43.2055703
  },
  {
    "EGGMASS_PER_HA": 150,
    "LONGITUDE": -79.9748412,
    "LATITUDE": 43.20670242
  },
  {
    "EGGMASS_PER_HA": 63,
    "LONGITUDE": -79.97499939,
    "LATITUDE": 43.26422512
  },
  {
    "EGGMASS_PER_HA": 563,
    "LONGITUDE": -79.97277116,
    "LATITUDE": 43.2604103
  },
  {
    "EGGMASS_PER_HA": 5750,
    "LONGITUDE": -79.97334775,
    "LATITUDE": 43.25991186
  },
  {
    "EGGMASS_PER_HA": 188,
    "LONGITUDE": -79.97735863,
    "LATITUDE": 43.26034883
  },
  {
    "EGGMASS_PER_HA": 535,
    "LONGITUDE": -80.00682261,
    "LATITUDE": 43.21962867
  },
  {
    "EGGMASS_PER_HA": 47104,
    "LONGITUDE": -79.92828052,
    "LATITUDE": 43.24536076
  },
  {
    "EGGMASS_PER_HA": 1300,
    "LONGITUDE": -79.92261495,
    "LATITUDE": 43.21959357
  },
  {
    "EGGMASS_PER_HA": 50,
    "LONGITUDE": -79.97796558,
    "LATITUDE": 43.20381449
  },
  {
    "EGGMASS_PER_HA": 200,
    "LONGITUDE": -79.94671526,
    "LATITUDE": 43.20763719
  },
  {
    "EGGMASS_PER_HA": 9600,
    "LONGITUDE": -79.97449567,
    "LATITUDE": 43.22184545
  },
  {
    "EGGMASS_PER_HA": 2150,
    "LONGITUDE": -79.98384925,
    "LATITUDE": 43.21848821
  },
  {
    "EGGMASS_PER_HA": 10262,
    "LONGITUDE": -79.98831566,
    "LATITUDE": 43.22429812
  },
  {
    "EGGMASS_PER_HA": 8200,
    "LONGITUDE": -79.96480331,
    "LATITUDE": 43.23074613
  },
  {
    "EGGMASS_PER_HA": "4,700",
    "LONGITUDE": -79.96926263,
    "LATITUDE": 43.22431851
  },
  {
    "EGGMASS_PER_HA": 100,
    "LONGITUDE": -79.96386465,
    "LATITUDE": 43.22671515
  },
  {
    "EGGMASS_PER_HA": 23667,
    "LONGITUDE": -79.96615493,
    "LATITUDE": 43.23598171
  },
  {
    "EGGMASS_PER_HA": 125,
    "LONGITUDE": -79.97600325,
    "LATITUDE": 43.25895506
  },
  {
    "EGGMASS_PER_HA": 688,
    "LONGITUDE": -79.97721496,
    "LATITUDE": 43.26161025
  },
  {
    "EGGMASS_PER_HA": 6375,
    "LONGITUDE": -79.97121465,
    "LATITUDE": 43.25991377
  },
  {
    "EGGMASS_PER_HA": 4538,
    "LONGITUDE": -79.95964382,
    "LATITUDE": 43.26354955
  },
  {
    "EGGMASS_PER_HA": 423,
    "LONGITUDE": -79.95838357,
    "LATITUDE": 43.26326466
  },
  {
    "EGGMASS_PER_HA": 60,
    "LONGITUDE": -79.96111156,
    "LATITUDE": 43.27166186
  },
  {
    "EGGMASS_PER_HA": 80,
    "LONGITUDE": -79.96032915,
    "LATITUDE": 43.27221483
  },
  {
    "EGGMASS_PER_HA": 20,
    "LONGITUDE": -79.95822896,
    "LATITUDE": 43.27319518
  },
  {
    "EGGMASS_PER_HA": 73,
    "LONGITUDE": -79.94431973,
    "LATITUDE": 43.27064023
  },
  {
    "EGGMASS_PER_HA": 6441,
    "LONGITUDE": -79.94651344,
    "LATITUDE": 43.27356087
  },
  {
    "EGGMASS_PER_HA": 6500,
    "LONGITUDE": -79.95196827,
    "LATITUDE": 43.26290223
  },
  {
    "EGGMASS_PER_HA": 1500,
    "LONGITUDE": -79.9629486,
    "LATITUDE": 43.25114199
  },
  {
    "EGGMASS_PER_HA": 400,
    "LONGITUDE": -79.89987696,
    "LATITUDE": 43.26271431
  },
  {
    "EGGMASS_PER_HA": 1300,
    "LONGITUDE": -79.8957482,
    "LATITUDE": 43.26960105
  },
  {
    "EGGMASS_PER_HA": 1800,
    "LONGITUDE": -79.89576347,
    "LATITUDE": 43.26904431
  },
  {
    "EGGMASS_PER_HA": 41,
    "LONGITUDE": -79.91030602,
    "LATITUDE": 43.26441229
  },
  {
    "EGGMASS_PER_HA": 1729,
    "LONGITUDE": -79.90983847,
    "LATITUDE": 43.26518124
  },
  {
    "EGGMASS_PER_HA": 41,
    "LONGITUDE": -79.91289617,
    "LATITUDE": 43.26543481
  },
  {
    "EGGMASS_PER_HA": 1235,
    "LONGITUDE": -79.90115652,
    "LATITUDE": 43.26905294
  },
  {
    "EGGMASS_PER_HA": 3100,
    "LONGITUDE": -79.93592108,
    "LATITUDE": 43.24938453
  },
  {
    "EGGMASS_PER_HA": 2600,
    "LONGITUDE": -79.87735357,
    "LATITUDE": 43.28731886
  },
  {
    "EGGMASS_PER_HA": 1577,
    "LONGITUDE": -79.93469292,
    "LATITUDE": 43.2827208
  },
  {
    "EGGMASS_PER_HA": 951,
    "LONGITUDE": -79.97826279,
    "LATITUDE": 43.25563781
  },
  {
    "EGGMASS_PER_HA": 915,
    "LONGITUDE": -79.97795586,
    "LATITUDE": 43.25620595
  },
  {
    "EGGMASS_PER_HA": 341,
    "LONGITUDE": -79.97803304,
    "LATITUDE": 43.25604259
  },
  {
    "EGGMASS_PER_HA": 431,
    "LONGITUDE": -79.97807749,
    "LATITUDE": 43.25644047
  },
  {
    "EGGMASS_PER_HA": 233,
    "LONGITUDE": -79.97821988,
    "LATITUDE": 43.25637405
  },
  {
    "EGGMASS_PER_HA": 1921,
    "LONGITUDE": -79.97903689,
    "LATITUDE": 43.25592046
  },
  {
    "EGGMASS_PER_HA": 1059,
    "LONGITUDE": -79.97933135,
    "LATITUDE": 43.25583381
  },
  {
    "EGGMASS_PER_HA": 1023,
    "LONGITUDE": -79.97955199,
    "LATITUDE": 43.25580516
  },
  {
    "EGGMASS_PER_HA": 1921,
    "LONGITUDE": -79.98021197,
    "LATITUDE": 43.25442461
  },
  {
    "EGGMASS_PER_HA": 269,
    "LONGITUDE": -79.98001203,
    "LATITUDE": 43.25500079
  },
  {
    "EGGMASS_PER_HA": 36,
    "LONGITUDE": -79.9797656,
    "LATITUDE": 43.25484391
  },
  {
    "EGGMASS_PER_HA": 220,
    "LONGITUDE": -79.93459505,
    "LATITUDE": 43.27366169
  },
  {
    "EGGMASS_PER_HA": 8940,
    "LONGITUDE": -79.94835546,
    "LATITUDE": 43.27442067
  },
  {
    "EGGMASS_PER_HA": 17528,
    "LONGITUDE": -79.95109441,
    "LATITUDE": 43.27099549
  },
  {
    "EGGMASS_PER_HA": 10267,
    "LONGITUDE": -79.94998553,
    "LATITUDE": 43.27177255
  },
  {
    "EGGMASS_PER_HA": 3123,
    "LONGITUDE": -79.9495981,
    "LATITUDE": 43.2719077
  },
  {
    "EGGMASS_PER_HA": 20182,
    "LONGITUDE": -79.95003641,
    "LATITUDE": 43.27129676
  },
  {
    "EGGMASS_PER_HA": 6480,
    "LONGITUDE": -79.94968222,
    "LATITUDE": 43.27132552
  },
  {
    "EGGMASS_PER_HA": 36461,
    "LONGITUDE": -79.94994563,
    "LATITUDE": 43.27035822
  },
  {
    "EGGMASS_PER_HA": 2225,
    "LONGITUDE": -79.94991698,
    "LATITUDE": 43.27411252
  },
  {
    "EGGMASS_PER_HA": 40,
    "LONGITUDE": -79.95837196,
    "LATITUDE": 43.27359716
  },
  {
    "EGGMASS_PER_HA": 215,
    "LONGITUDE": -79.97015905,
    "LATITUDE": 43.22495681
  },
  {
    "EGGMASS_PER_HA": 1867,
    "LONGITUDE": -79.9696262,
    "LATITUDE": 43.22610831
  },
  {
    "EGGMASS_PER_HA": 54,
    "LONGITUDE": -79.96899353,
    "LATITUDE": 43.22631657
  },
  {
    "EGGMASS_PER_HA": 72,
    "LONGITUDE": -79.96898868,
    "LATITUDE": 43.22615528
  },
  {
    "EGGMASS_PER_HA": 20,
    "LONGITUDE": -80.00915091,
    "LATITUDE": 43.21763313
  },
  {
    "EGGMASS_PER_HA": 7786,
    "LONGITUDE": -80.00930812,
    "LATITUDE": 43.22103078
  },
  {
    "EGGMASS_PER_HA": 6241,
    "LONGITUDE": -80.00652122,
    "LATITUDE": 43.21740761
  },
  {
    "EGGMASS_PER_HA": 911,
    "LONGITUDE": -80.00677855,
    "LATITUDE": 43.21849593
  },
  {
    "EGGMASS_PER_HA": 3923,
    "LONGITUDE": -80.01008387,
    "LATITUDE": 43.22082809
  },
  {
    "EGGMASS_PER_HA": 5290,
    "LONGITUDE": -80.00149172,
    "LATITUDE": 43.2287265
  },
  {
    "EGGMASS_PER_HA": 50,
    "LONGITUDE": -80.00539355,
    "LATITUDE": 43.20775036
  },
  {
    "EGGMASS_PER_HA": 250,
    "LONGITUDE": -79.99104453,
    "LATITUDE": 43.20116963
  },
  {
    "EGGMASS_PER_HA": 50,
    "LONGITUDE": -79.9908983,
    "LATITUDE": 43.20077968
  },
  {
    "EGGMASS_PER_HA": 150,
    "LONGITUDE": -79.96152292,
    "LATITUDE": 43.21198279
  },
  {
    "EGGMASS_PER_HA": 50007,
    "LONGITUDE": -79.95234348,
    "LATITUDE": 43.27112447
  },
  {
    "EGGMASS_PER_HA": 16786,
    "LONGITUDE": -79.95091664,
    "LATITUDE": 43.26980301
  },
  {
    "EGGMASS_PER_HA": 1750,
    "LONGITUDE": -79.91366417,
    "LATITUDE": 43.24525677
  },
  {
    "EGGMASS_PER_HA": 600,
    "LONGITUDE": -79.92366492,
    "LATITUDE": 43.22254084
  },
  {
    "EGGMASS_PER_HA": 100,
    "LONGITUDE": -79.96020943,
    "LATITUDE": 43.21837936
  },
  {
    "EGGMASS_PER_HA": "",
    "LONGITUDE": -79.99114633,
    "LATITUDE": 43.21916483
  },
  {
    "EGGMASS_PER_HA": 1508,
    "LONGITUDE": -79.97598955,
    "LATITUDE": 43.25869364
  },
  {
    "EGGMASS_PER_HA": 100,
    "LONGITUDE": -79.96642415,
    "LATITUDE": 43.27014914
  },
  {
    "EGGMASS_PER_HA": 73,
    "LONGITUDE": -79.94516032,
    "LATITUDE": 43.26803182
  },
  {
    "EGGMASS_PER_HA": 293,
    "LONGITUDE": -79.94429169,
    "LATITUDE": 43.26581417
  },
  {
    "EGGMASS_PER_HA": 7297,
    "LONGITUDE": -79.94325513,
    "LATITUDE": 43.27239849
  },
  {
    "EGGMASS_PER_HA": 4850,
    "LONGITUDE": -79.96281919,
    "LATITUDE": 43.25127372
  },
  {
    "EGGMASS_PER_HA": 100,
    "LONGITUDE": -79.93264071,
    "LATITUDE": 43.25532527
  },
  {
    "EGGMASS_PER_HA": 183,
    "LONGITUDE": -79.93350623,
    "LATITUDE": 43.2974345
  },
  {
    "EGGMASS_PER_HA": 1375,
    "LONGITUDE": -79.91785345,
    "LATITUDE": 43.30645592
  },
  {
    "EGGMASS_PER_HA": 26858,
    "LONGITUDE": -79.92745207,
    "LATITUDE": 43.28983774
  },
  {
    "EGGMASS_PER_HA": 100,
    "LONGITUDE": -79.97907214,
    "LATITUDE": 43.29552923
  },
  {
    "EGGMASS_PER_HA": 14200,
    "LONGITUDE": -80.01695432,
    "LATITUDE": 43.21204322
  },
  {
    "EGGMASS_PER_HA": 150,
    "LONGITUDE": -80.07276383,
    "LATITUDE": 43.19383778
  },
  {
    "EGGMASS_PER_HA": 100,
    "LONGITUDE": -80.01482539,
    "LATITUDE": 43.20524628
  },
  {
    "EGGMASS_PER_HA": 8365,
    "LONGITUDE": -79.99324351,
    "LATITUDE": 43.26780354
  },
  {
    "EGGMASS_PER_HA": 58,
    "LONGITUDE": -79.99938822,
    "LATITUDE": 43.26527273
  },
  {
    "EGGMASS_PER_HA": 8654,
    "LONGITUDE": -80.01078241,
    "LATITUDE": 43.26318346
  },
  {
    "EGGMASS_PER_HA": 346,
    "LONGITUDE": -80.00753935,
    "LATITUDE": 43.27233565
  },
  {
    "EGGMASS_PER_HA": 1078,
    "LONGITUDE": -80.027101,
    "LATITUDE": 43.24995106
  },
  {
    "EGGMASS_PER_HA": 7095,
    "LONGITUDE": -80.00817869,
    "LATITUDE": 43.25284778
  },
  {
    "EGGMASS_PER_HA": 25086,
    "LONGITUDE": -80.00519736,
    "LATITUDE": 43.24487637
  },
  {
    "EGGMASS_PER_HA": 5175,
    "LONGITUDE": -80.00343875,
    "LATITUDE": 43.20920953
  },
  {
    "EGGMASS_PER_HA": 150,
    "LONGITUDE": -79.9983331,
    "LATITUDE": 43.20713367
  },
  {
    "EGGMASS_PER_HA": 100,
    "LONGITUDE": -79.98791822,
    "LATITUDE": 43.21187966
  },
  {
    "EGGMASS_PER_HA": 900,
    "LONGITUDE": -79.96062924,
    "LATITUDE": 43.22873966
  },
  {
    "EGGMASS_PER_HA": 2950,
    "LONGITUDE": -79.96626153,
    "LATITUDE": 43.24192853
  },
  {
    "EGGMASS_PER_HA": 950,
    "LONGITUDE": -79.95220476,
    "LATITUDE": 43.24454576
  }
]