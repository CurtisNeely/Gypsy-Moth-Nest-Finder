var map;
var eggData;
		
function loadMap(){
	
	map = new Microsoft.Maps.Map(document.getElementById('mothMap'), {
		center: new Microsoft.Maps.Location(43.2665, -79.9569)
	});

	loadMothPins('all');
}

function pushpinClicked(e){
	
	if (e.target.metadata){
		
		infobox.setOptions({
			location: e.target.getLocation(),
			title: e.target.metadata.title,
			description: e.target.metadata.description,
			visible: true
		});
	}
}
	
function loadMothPins(filter){
	
	clearMap();
	
	infobox = new Microsoft.Maps.Infobox(map.getCenter(), 
	{
		visible: false
	});
				
	infobox.setMap(map);
	
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

			pin.metadata = 
			{
				description: "<b>Tree</b><br> " + eggData[x].SPECIES +
							 "<br>" + 
							 "<b>Street</b><br> " + eggData[x].STREET
			};
			
			Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);
				
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
			
			pin.metadata = 
			{
				description: "<b>Tree</b><br> " + eggData[x].SPECIES +
							 "<br>" + 
							 "<b>Street</b><br> " + eggData[x].STREET
			};
			
			Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);

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
			
			pin.metadata = 
			{
				description: "<b>Tree</b><br> " + eggData[x].SPECIES +
							 "<br>" + 
							 "<b>Street</b><br> " + eggData[x].STREET
			};
			
			Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);

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
	
	changeButtonIconTo('load');

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
		
		changeButtonIconTo('x');
		
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

			changeButtonIconTo('check');
			
			loadMothPins('userReported');
		});
	});
}

function changeButtonIconTo(className){
	
	if(className === 'check'){
		
		document.getElementById("reportIcon").className = "far fa-check-circle";
		
	}else if(className === 'bug'){
		
		document.getElementById("reportIcon").className = "fas fa-bug";
		
	}else if(className === 'load'){
		
		document.getElementById("reportIcon").className = "fa fa-spinner fa-pulse";
		
	}else if(className === 'x'){
		
		document.getElementById("reportIcon").className = "far fa-times-circle";
		
	}else{
		
		console.log("Something went wrong with changing icons");
	}
	
}

eggData = 
[
 {
   "STREET": "Miller Dr",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "550",
   "LONGITUDE": -79.97752059,
   "LATITUDE": 43.2055703
 },
 {
   "STREET": "Miller Dr",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "150",
   "LONGITUDE": -79.9748412,
   "LATITUDE": 43.20670242
 },
 {
   "STREET": "Larraine Av",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "63",
   "LONGITUDE": -79.97499939,
   "LATITUDE": 43.26422512
 },
 {
   "STREET": "Huntingwood Av",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "563",
   "LONGITUDE": -79.97277116,
   "LATITUDE": 43.2604103
 },
 {
   "STREET": "Huntingwood Av",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "5750",
   "LONGITUDE": -79.97334775,
   "LATITUDE": 43.25991186
 },
 {
   "STREET": "Huntingwood Av",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "188",
   "LONGITUDE": -79.97735863,
   "LATITUDE": 43.26034883
 },
 {
   "STREET": "Rotary Wy",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "535",
   "LONGITUDE": -80.00682261,
   "LATITUDE": 43.21962867
 },
 {
   "STREET": "Scenic Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "47104",
   "LONGITUDE": -79.92828052,
   "LATITUDE": 43.24536076
 },
 {
   "STREET": "Stone Church Rd",
   "SPECIES": "Red Maple ",
   "EGGMASS_PER_HA": "1300",
   "LONGITUDE": -79.92261495,
   "LATITUDE": 43.21959357
 },
 {
   "STREET": "Garden Av",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "50",
   "LONGITUDE": -79.97796558,
   "LATITUDE": 43.20381449
 },
 {
   "STREET": "Garner Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "200",
   "LONGITUDE": -79.94671526,
   "LATITUDE": 43.20763719
 },
 {
   "STREET": "Golf Links Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "9600",
   "LONGITUDE": -79.97449567,
   "LATITUDE": 43.22184545
 },
 {
   "STREET": "56 St. Margarets Rd",
   "SPECIES": "Pin Oak ",
   "EGGMASS_PER_HA": "2150",
   "LONGITUDE": -79.98384925,
   "LATITUDE": 43.21848821
 },
 {
   "STREET": "135 Lovers Ln",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "10262",
   "LONGITUDE": -79.98831566,
   "LATITUDE": 43.22429812
 },
 {
   "STREET": "191 Lime Kiln Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "8200",
   "LONGITUDE": -79.96480331,
   "LATITUDE": 43.23074613
 },
 {
   "STREET": "Seymour Dr",
   "SPECIES": "English Oak ",
   "EGGMASS_PER_HA": "4,700",
   "LONGITUDE": -79.96926263,
   "LATITUDE": 43.22431851
 },
 {
   "STREET": "72 Mcniven Rd",
   "SPECIES": "Pin Oak ",
   "EGGMASS_PER_HA": "100",
   "LONGITUDE": -79.96386465,
   "LATITUDE": 43.22671515
 },
 {
   "STREET": "775 Alexander Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "23667",
   "LONGITUDE": -79.96615493,
   "LATITUDE": 43.23598171
 },
 {
   "STREET": "Governor'S Rd",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "125",
   "LONGITUDE": -79.97600325,
   "LATITUDE": 43.25895506
 },
 {
   "STREET": "80 Golfview Cr",
   "SPECIES": "English Oak ",
   "EGGMASS_PER_HA": "688",
   "LONGITUDE": -79.97721496,
   "LATITUDE": 43.26161025
 },
 {
   "STREET": "259 Governor'S Rd",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "6375",
   "LONGITUDE": -79.97121465,
   "LATITUDE": 43.25991377
 },
 {
   "STREET": "19 Chegwin St",
   "SPECIES": "Pin Oak ",
   "EGGMASS_PER_HA": "4538",
   "LONGITUDE": -79.95964382,
   "LATITUDE": 43.26354955
 },
 {
   "STREET": "Chegwin St",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "423",
   "LONGITUDE": -79.95838357,
   "LATITUDE": 43.26326466
 },
 {
   "STREET": "Sundial Cr",
   "SPECIES": "Basswood",
   "EGGMASS_PER_HA": "60",
   "LONGITUDE": -79.96111156,
   "LATITUDE": 43.27166186
 },
 {
   "STREET": "Sundial Cr",
   "SPECIES": "Swamp White Oak ",
   "EGGMASS_PER_HA": "80",
   "LONGITUDE": -79.96032915,
   "LATITUDE": 43.27221483
 },
 {
   "STREET": "Sydenham St",
   "SPECIES": "Eastern Cottonwood ",
   "EGGMASS_PER_HA": "20",
   "LONGITUDE": -79.95822896,
   "LATITUDE": 43.27319518
 },
 {
   "STREET": "35 Concord Av",
   "SPECIES": "Bur Oak ",
   "EGGMASS_PER_HA": "73",
   "LONGITUDE": -79.94431973,
   "LATITUDE": 43.27064023
 },
 {
   "STREET": "Delsey St",
   "SPECIES": "Bur Oak ",
   "EGGMASS_PER_HA": "6441",
   "LONGITUDE": -79.94651344,
   "LATITUDE": 43.27356087
 },
 {
   "STREET": "118 Main St",
   "SPECIES": "Siberian Elm",
   "EGGMASS_PER_HA": "6500",
   "LONGITUDE": -79.95196827,
   "LATITUDE": 43.26290223
 },
 {
   "STREET": "Terrace Dr",
   "SPECIES": "Siberian Elm",
   "EGGMASS_PER_HA": "1500",
   "LONGITUDE": -79.9629486,
   "LATITUDE": 43.25114199
 },
 {
   "STREET": "King St",
   "SPECIES": "English Oak Fastigiata",
   "EGGMASS_PER_HA": "400",
   "LONGITUDE": -79.89987696,
   "LATITUDE": 43.26271431
 },
 {
   "STREET": "Paradise Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "1300",
   "LONGITUDE": -79.8957482,
   "LATITUDE": 43.26960105
 },
 {
   "STREET": "Paradise Rd",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "1800",
   "LONGITUDE": -79.89576347,
   "LATITUDE": 43.26904431
 },
 {
   "STREET": "Oak Knoll Dr",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "41",
   "LONGITUDE": -79.91030602,
   "LATITUDE": 43.26441229
 },
 {
   "STREET": "Oak Knoll Dr",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "1729",
   "LONGITUDE": -79.90983847,
   "LATITUDE": 43.26518124
 },
 {
   "STREET": "Mayfair Cr",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "41",
   "LONGITUDE": -79.91289617,
   "LATITUDE": 43.26543481
 },
 {
   "STREET": "Parkside Dr",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "1235",
   "LONGITUDE": -79.90115652,
   "LATITUDE": 43.26905294
 },
 {
   "STREET": "Purvis Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "3100",
   "LONGITUDE": -79.93592108,
   "LATITUDE": 43.24938453
 },
 {
   "STREET": "Spring Gardens Rd",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "2600",
   "LONGITUDE": -79.87735357,
   "LATITUDE": 43.28731886
 },
 {
   "STREET": "Renata Ct",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "1577",
   "LONGITUDE": -79.93469292,
   "LATITUDE": 43.2827208
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "951",
   "LONGITUDE": -79.97826279,
   "LATITUDE": 43.25563781
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "915",
   "LONGITUDE": -79.97795586,
   "LATITUDE": 43.25620595
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Black Walnut ",
   "EGGMASS_PER_HA": "341",
   "LONGITUDE": -79.97803304,
   "LATITUDE": 43.25604259
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "431",
   "LONGITUDE": -79.97807749,
   "LATITUDE": 43.25644047
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "233",
   "LONGITUDE": -79.97821988,
   "LATITUDE": 43.25637405
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "1921",
   "LONGITUDE": -79.97903689,
   "LATITUDE": 43.25592046
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Ironwood ",
   "EGGMASS_PER_HA": "1059",
   "LONGITUDE": -79.97933135,
   "LATITUDE": 43.25583381
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "1023",
   "LONGITUDE": -79.97955199,
   "LATITUDE": 43.25580516
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "1921",
   "LONGITUDE": -79.98021197,
   "LATITUDE": 43.25442461
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "269",
   "LONGITUDE": -79.98001203,
   "LATITUDE": 43.25500079
 },
 {
   "STREET": "Bridlewood Dr",
   "SPECIES": "Basswood",
   "EGGMASS_PER_HA": "36",
   "LONGITUDE": -79.9797656,
   "LATITUDE": 43.25484391
 },
 {
   "STREET": "Olympic Dr",
   "SPECIES": "Common Apple",
   "EGGMASS_PER_HA": "220",
   "LONGITUDE": -79.93459505,
   "LATITUDE": 43.27366169
 },
 {
   "STREET": "Cross St",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "8940",
   "LONGITUDE": -79.94835546,
   "LATITUDE": 43.27442067
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "Pin Oak ",
   "EGGMASS_PER_HA": "17528",
   "LONGITUDE": -79.95109441,
   "LATITUDE": 43.27099549
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "10267",
   "LONGITUDE": -79.94998553,
   "LATITUDE": 43.27177255
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "3123",
   "LONGITUDE": -79.9495981,
   "LATITUDE": 43.2719077
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "20182",
   "LONGITUDE": -79.95003641,
   "LATITUDE": 43.27129676
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "6480",
   "LONGITUDE": -79.94968222,
   "LATITUDE": 43.27132552
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "36461",
   "LONGITUDE": -79.94994563,
   "LATITUDE": 43.27035822
 },
 {
   "STREET": "Cross St",
   "SPECIES": "Manitoba Maple ",
   "EGGMASS_PER_HA": "2225",
   "LONGITUDE": -79.94991698,
   "LATITUDE": 43.27411252
 },
 {
   "STREET": "Sydenham St",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "40",
   "LONGITUDE": -79.95837196,
   "LATITUDE": 43.27359716
 },
 {
   "STREET": "Seymour Dr",
   "SPECIES": "Manitoba Maple ",
   "EGGMASS_PER_HA": "215",
   "LONGITUDE": -79.97015905,
   "LATITUDE": 43.22495681
 },
 {
   "STREET": "Seymour Dr",
   "SPECIES": "Crack Willow ",
   "EGGMASS_PER_HA": "1867",
   "LONGITUDE": -79.9696262,
   "LATITUDE": 43.22610831
 },
 {
   "STREET": "Seymour Dr",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "54",
   "LONGITUDE": -79.96899353,
   "LATITUDE": 43.22631657
 },
 {
   "STREET": "Seymour Dr",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "72",
   "LONGITUDE": -79.96898868,
   "LATITUDE": 43.22615528
 },
 {
   "STREET": "Rotary Wy",
   "SPECIES": "Red Maple ",
   "EGGMASS_PER_HA": "20",
   "LONGITUDE": -80.00915091,
   "LATITUDE": 43.21763313
 },
 {
   "STREET": "Rotary Wy",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "7786",
   "LONGITUDE": -80.00930812,
   "LATITUDE": 43.22103078
 },
 {
   "STREET": "Rotary Wy",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "6241",
   "LONGITUDE": -80.00652122,
   "LATITUDE": 43.21740761
 },
 {
   "STREET": "Rotary Wy",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "911",
   "LONGITUDE": -80.00677855,
   "LATITUDE": 43.21849593
 },
 {
   "STREET": "Rotary Wy",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "3923",
   "LONGITUDE": -80.01008387,
   "LATITUDE": 43.22082809
 },
 {
   "STREET": "Summerdale Pl",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "5290",
   "LONGITUDE": -80.00149172,
   "LATITUDE": 43.2287265
 },
 {
   "STREET": "Valecrest Av",
   "SPECIES": "Manitoba Maple ",
   "EGGMASS_PER_HA": "50",
   "LONGITUDE": -80.00539355,
   "LATITUDE": 43.20775036
 },
 {
   "STREET": "Braithwaite Av",
   "SPECIES": "White Oak",
   "EGGMASS_PER_HA": "250",
   "LONGITUDE": -79.99104453,
   "LATITUDE": 43.20116963
 },
 {
   "STREET": "Braithwaite Av",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "50",
   "LONGITUDE": -79.9908983,
   "LATITUDE": 43.20077968
 },
 {
   "STREET": "Annalee Dr",
   "SPECIES": "Black Cherry",
   "EGGMASS_PER_HA": "150",
   "LONGITUDE": -79.96152292,
   "LATITUDE": 43.21198279
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "50007",
   "LONGITUDE": -79.95234348,
   "LATITUDE": 43.27112447
 },
 {
   "STREET": "Dundas Driving Park Rd",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "16786",
   "LONGITUDE": -79.95091664,
   "LATITUDE": 43.26980301
 },
 {
   "STREET": "Scenic Dr",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "1750",
   "LONGITUDE": -79.91366417,
   "LATITUDE": 43.24525677
 },
 {
   "STREET": "Golfwood Dr",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "600",
   "LONGITUDE": -79.92366492,
   "LATITUDE": 43.22254084
 },
 {
   "STREET": "Southcote Rd",
   "SPECIES": "Silver Maple ",
   "EGGMASS_PER_HA": "100",
   "LONGITUDE": -79.96020943,
   "LATITUDE": 43.21837936
 },
 {
   "STREET": "Postans Path",
   "SPECIES": "Silver Maple ",
   "EGGMASS_PER_HA": " ",
   "LONGITUDE": -79.99114633,
   "LATITUDE": 43.21916483
 },
 {
   "STREET": "Governor'S Rd",
   "SPECIES": "Silver Maple ",
   "EGGMASS_PER_HA": "1508",
   "LONGITUDE": -79.97598955,
   "LATITUDE": 43.25869364
 },
 {
   "STREET": "Peel St",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "100",
   "LONGITUDE": -79.96642415,
   "LATITUDE": 43.27014914
 },
 {
   "STREET": "1 Hunter St",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "73",
   "LONGITUDE": -79.94516032,
   "LATITUDE": 43.26803182
 },
 {
   "STREET": "Cootes Dr",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "293",
   "LONGITUDE": -79.94429169,
   "LATITUDE": 43.26581417
 },
 {
   "STREET": "22 Wilmar Ct",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "7297",
   "LONGITUDE": -79.94325513,
   "LATITUDE": 43.27239849
 },
 {
   "STREET": "Terrace Dr",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "4850",
   "LONGITUDE": -79.96281919,
   "LATITUDE": 43.25127372
 },
 {
   "STREET": "Ofield Rd",
   "SPECIES": "Basswood",
   "EGGMASS_PER_HA": "100",
   "LONGITUDE": -79.93264071,
   "LATITUDE": 43.25532527
 },
 {
   "STREET": "Rock Chapel Rd",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "183",
   "LONGITUDE": -79.93350623,
   "LATITUDE": 43.2974345
 },
 {
   "STREET": "South Dr",
   "SPECIES": "Basswood",
   "EGGMASS_PER_HA": "1375",
   "LONGITUDE": -79.91785345,
   "LATITUDE": 43.30645592
 },
 {
   "STREET": "York Rd",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "26858",
   "LONGITUDE": -79.92745207,
   "LATITUDE": 43.28983774
 },
 {
   "STREET": "Ofield Rd",
   "SPECIES": "Basswood",
   "EGGMASS_PER_HA": "100",
   "LONGITUDE": -79.97907214,
   "LATITUDE": 43.29552923
 },
 {
   "STREET": "Shaver Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "14200",
   "LONGITUDE": -80.01695432,
   "LATITUDE": 43.21204322
 },
 {
   "STREET": "Alberton Rd",
   "SPECIES": "Silver Maple ",
   "EGGMASS_PER_HA": "150",
   "LONGITUDE": -80.07276383,
   "LATITUDE": 43.19383778
 },
 {
   "STREET": "Shaver Rd",
   "SPECIES": "Shagbark Hickory ",
   "EGGMASS_PER_HA": "100",
   "LONGITUDE": -80.01482539,
   "LATITUDE": 43.20524628
 },
 {
   "STREET": "5 Rosebough St",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "8365",
   "LONGITUDE": -79.99324351,
   "LATITUDE": 43.26780354
 },
 {
   "STREET": "77 Maple Av",
   "SPECIES": "Silver Maple ",
   "EGGMASS_PER_HA": "58",
   "LONGITUDE": -79.99938822,
   "LATITUDE": 43.26527273
 },
 {
   "STREET": "Weirs Lane",
   "SPECIES": "Manitoba Maple ",
   "EGGMASS_PER_HA": "8654",
   "LONGITUDE": -80.01078241,
   "LATITUDE": 43.26318346
 },
 {
   "STREET": "Highway No. 8",
   "SPECIES": "Manitoba Maple ",
   "EGGMASS_PER_HA": "346",
   "LONGITUDE": -80.00753935,
   "LATITUDE": 43.27233565
 },
 {
   "STREET": "Middletown Rd",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "1078",
   "LONGITUDE": -80.027101,
   "LATITUDE": 43.24995106
 },
 {
   "STREET": "Governor'S Rd",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "7095",
   "LONGITUDE": -80.00817869,
   "LATITUDE": 43.25284778
 },
 {
   "STREET": "Sulphur Springs Rd",
   "SPECIES": "Red Oak ",
   "EGGMASS_PER_HA": "25086",
   "LONGITUDE": -80.00519736,
   "LATITUDE": 43.24487637
 },
 {
   "STREET": "Meadowbrook Dr",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "5175",
   "LONGITUDE": -80.00343875,
   "LATITUDE": 43.20920953
 },
 {
   "STREET": "Amberley Dr",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "150",
   "LONGITUDE": -79.9983331,
   "LATITUDE": 43.20713367
 },
 {
   "STREET": "Oakly Crt",
   "SPECIES": "Silver Maple ",
   "EGGMASS_PER_HA": "100",
   "LONGITUDE": -79.98791822,
   "LATITUDE": 43.21187966
 },
 {
   "STREET": "Cayuga Trail",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "900",
   "LONGITUDE": -79.96062924,
   "LATITUDE": 43.22873966
 },
 {
   "STREET": "Lions Club Road",
   "SPECIES": "Norway Maple ",
   "EGGMASS_PER_HA": "2950",
   "LONGITUDE": -79.96626153,
   "LATITUDE": 43.24192853
 },
 {
   "STREET": "Lions Club Road",
   "SPECIES": "Sugar Maple ",
   "EGGMASS_PER_HA": "950",
   "LONGITUDE": -79.95220476,
   "LATITUDE": 43.24454576
 }
]