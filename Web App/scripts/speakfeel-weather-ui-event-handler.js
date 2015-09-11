var icons = {
				"clear-day" 			: "B",
				"clear-night" 			: "C",
				"rain"					: "R",
				"snow"					: "G",
				"sleet"					: "X",
				"wind"					: "S",
				"fog"					: "N",
				"cloudy"				: "Y",
				"partly-cloudy-day"		: "H",
				"partly-cloudy-night"	: "I",
		};

var days = {
		"0"		:	"Sunday",
		"1"		:	"Monday",
		"2"		:	"Tuesday",
		"3"		:	"Wednesday",
		"4"		:	"Thursday",
		"5"		:	"Friday",
		"6"		:	"Saturday"
};


function convertFahrenheitToCelsius(FarenheitTemp){
	return Math.round((((FarenheitTemp - 32) * 5)/9)*10)/10;
}


function updateCurrentWeather (json) {
        var celsiusTemp = convertFahrenheitToCelsius(json.currently.temperature);		
		var date = new Date();		
		var dateTime = days[date.getDay().toString()] + ' ' + date.getHours() + ':' + date.getMinutes();
		console.log(dateTime);		
		$("#current_temp").html(celsiusTemp + "&#176;C");
		$("#current_summary").html(json.currently.summary);
		$("#current_temp").attr("data-icon",icons[json.currently.icon]);
		$("#current_date_time").html(dateTime);
} 


function weeklyForecast (json) {		
	var Day = 0;	
	var outhtml;
	for ( var i = 0; i <= 6; i++)
	{
		outhtml = "";
		Day = Day + 1
		//check if day is greater than number in week
		if ( Day === 7) {
			Day = 0;
		}		
		//format html
		outhtml = '<li><h3 class="icon" data-icon="' + icons[json.daily.data[i].icon] + ' ">' + days[Day];
		outhtml = outhtml + " Max " + convertFahrenheitToCelsius(json.daily.data[i].temperatureMax) + "&#176;C ";
		outhtml = outhtml + " Min " + convertFahrenheitToCelsius(json.daily.data[i].temperatureMin) + "&#176;C";
		outhtml = outhtml + '</h3></li>';
		//append new html li item to list view
		$(".WeekForecast").append(outhtml);
	}
}

function loadWeather() {
	if ( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
}

//Get the latitude and the longitude;
function successFunction(position) {
	var apiKey = 'a8b2ddaedd8d59e023e1ed19db054fb9';
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    loadCity(latitude, longitude)
	var latlng = latitude + "," + longitude;
	var forecastURL = "https://api.forecast.io/forecast/" + apiKey + "/" + latlng;
    var body = $("body");
	$.ajax({
		url: forecastURL,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		beforeSend: function() {
			body.addClass("loading"); },
		success: function(json) {
			body.removeClass("loading");		    
			updateCurrentWeather(json);
			weeklyForecast(json);
		},
		error: function(e) {
			console.log(e.message);
		}
	});
}

function errorFunction(){
    console.log("Geocoder failed");
}

function loadCity(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
	var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
		console.log(results);
        if (results[1]) {
         //formatted address
         console.log(results[0].formatted_address)
        //find country name
        for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {

            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "locality") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
            }
        }
			//city data			
			var city = city.long_name;		
			console.log( city );        
			$("#location").html(city);
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
}






