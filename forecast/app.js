angular.module("ForecastApp", [])
	.controller("WeatherServiceController", ["$scope", "$http", 
				"GoogleGeolocationService", "DarkSkyWeatherService",
		function($scope, $http, GoogleGeolocationService, DarkSkyWeatherService){
		   
		   var wsc = this;
		   
		   //holds the cities the user can choose from
		   $http.get("data.txt")
				.then(function(response){
					wsc.temporary = response.data;
				//	console.log(response);
					wsc.cities = wsc.temporary.cities;
				//	console.log(wsc.cities);
					wsc.displayName = wsc.cities[0].name;
					wsc.selected_city = wsc.cities[0];
				//	console.log(wsc.selected_city);
					wsc.getLatLonForSelected();
				});
		   
		   //key: AIzaSyCgD1dKYMnvg0Kn4OkCqvUZlK2wWdKJbhc
		   
		   //name of the app
		   wsc.app_name = "Weather App";
		   
		   //holds the latitude and longitude of selected city
		   wsc.selected_lat = 0;
		   wsc.selected_lon = 0;
		   
		   //holds the website we are using the gifs from 
		   wsc.imageSource = "";
		   
		   
				
		   
		   //given the selected_city determines the lat and lon
		   wsc.getLatLonForSelected = function(){
		   		GoogleGeolocationService.geoLocate(wsc.selected_city)
		   			.then(function(res){
		   				wsc.selected_lat = res.data.results[0].geometry.location.lat;
		   				wsc.selected_lon = res.data.results[0].geometry.location.lng;
		   				
		   				wsc.selected_city.lat = wsc.selected_lat;
		   				wsc.selected_city.lon = wsc.selected_lon;
		   				
		   				
		   				var google_static_maps_key = "AIzaSyCgD1dKYMnvg0Kn4OkCqvUZlK2wWdKJbhc";
		   				wsc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                                 wsc.selected_lat + "," +
                                                 wsc.selected_lon + 
                                                 "&zoom=10&size=600x300&key=" +
                                                 google_static_maps_key;
		   				
		   				//console.log(res);
		   				wsc.getCurrentConditions();

		   			})
		   			.catch(function(err){
		   				console.log(err);
		   			});
		   };
		   
		   //given the lat and lon gets current conditions
		   wsc.getCurrentConditions = function(){
		   		DarkSkyWeatherService.getCurrentConditions(wsc.selected_city)
		   			.then(function(res){
		   				//get the weather stuff here
		   				
		   				wsc.observation_time = res.data.currently.time * 1000;
		   				wsc.temperature = res.data.currently.temperature;
		   				wsc.dewpoint = res.data.currently.dewPoint;
		   				wsc.windBearing = res.data.currently.windBearing;
		   				wsc.windSpeed = res.data.currently.windSpeed;
		   				wsc.icon = res.data.currently.icon;
		   				wsc.summary = res.data.currently.summary;
		   			//	wsc.icon = "partly-cloudy-night"
		   				wsc.determinePicture();
		   				console.log(res);
		   			})
		   			.catch(function(err){
		   				console.log(err);
		   			});
		   };
		   
		   //gets lat and lon when selected city changes
		   wsc.selectTheCity = function(){
		   		wsc.getLatLonForSelected();
		   		
		   };
		   
		   //finds the url for the picture
		   wsc.determinePicture = function(){
		   	
		   	//https://www.behance.net/gallery/16071075/Animated-Weather-Icons
		   	
		   	switch(wsc.icon){
		   		case "clear-day":
		   			wsc.imageSource = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/421f0c16071075.562a500e6ddd4.gif";
		   			break;
		   		case "clear-night":
		   			wsc.imageSource = "http://brandonfryedesign.com/projects/weather-api/icons/clear-night.gif";
		   			break;
		   		case "rain":
		   			wsc.imageSource = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/7205bf16071075.562a50132e33e.gif";
		   			break;
		   		case "snow":
		   			wsc.imageSource = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/a2405c16071075.562a5050beed0.gif";
		   			break;
		   		case "sleet":
		   			wsc.imageSource = "http://rs122.pbsrc.com/albums/o266/weatherstooge/TWC%20Icons%20-%201990-1998/RFTF/Sleet.gif~c200";
		   			break;
		   		case "wind":
		   			wsc.imageSource = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/0670e516071075.562a5050cf157.gif";
		   			break;
		   		case "fog":
		   			wsc.imageSource = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/4d353e16071075.562a504473c5c.gif";
		   			break;
		   		case "cloudy":
		   			wsc.imageSource = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/d241d716071075.562a50091d914.gif";
		   			break;
		   		case "partly-cloudy-day":
		   			wsc.imageSource = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/c81fed16071075.562a501d5e911.gif";
		   			break;
		   		case "partly-cloudy-night":
		   			wsc.imageSource = "http://brandonfryedesign.com/projects/weather-api/icons/partly-cloudy-night.gif";
		   			break;
		   	}	
		   };
		   
		   
		   //original calls
		  
		   
		   
			
		}])
		//holds the majority of the html
	.directive('myConditions', ['$sce', function($sce){
		
		/*
		The restrict option is typically set to:

		'A' - only matches attribute name
		'E' - only matches element name
		'C' - only matches class name
		'M' - only matches comment
		*/
		return{
			restriction: 'E',
			scope: true,
			templateUrl: $sce.trustAsResourceUrl('currentConditions.html')	
		}
	}])
	
	//finds the lat and lon
	.factory('GoogleGeolocationService', ['$sce', '$http', 
		function($sce, $http){
			
			
			//https://docs.angularjs.org/api/ng/service/$sce
			
//1. create an empty object		
			var geolocationService = {};
			
//2. local variables need to be declared			
			//Google Maps Geocoding API Key
			var key = "AIzaSyCgD1dKYMnvg0Kn4OkCqvUZlK2wWdKJbhc";
//3. make a function			
			geolocationService.geoLocate = function(location){
//4. create the URL				
				//this returns a javascript promise "geolocationService"
				var address = "+"+location.name+",+"+location.state;
				var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
							+address+"&key="+key;
//5. Trust the URL with sce							
				var trustedurl = $sce.trustAsResourceUrl(url);
//6. Return the url with $http.get (the promise)				
				return $http.get(trustedurl);
				
				};
				return geolocationService;
	}])
	
	//finds the actual weather
	.factory('DarkSkyWeatherService', ['$sce', '$http',
		function($sce, $http){
				
				var darkSkyWeatherService = {};
				
				//DarkSky API key
				var key = "cbc599f65e3253df70f69be7a60b673e";
				
				darkSkyWeatherService.getCurrentConditions = function(location){
					
					var url = "https://api.darksky.net/forecast/" + key + 
								"/" + location.lat + "," + location.lon;
								
					var trustedUrl = $sce.trustAsResourceUrl(url);
					return $http.jsonp(trustedUrl, {jsonpCallbackParam: 'callback'});
					
					console.log("Darksky Api Url: ");		
					console.log(url);
				};
				
				return darkSkyWeatherService;
		}])
		
	//formats the temperature, wind direction, wind speed, and dewpoint values
	.filter('temp', function(){
		
		return function(fa){
			var celc = (fa - 32) * (5/9);
			var realCelsius = celc.toFixed(2);
			
			return fa + "  (" + realCelsius + ") C";
		};
	})
	
	.filter("windDirection", function(){
		return function(bearing){
			var direction;
			bearing.toFixed(2);
			if(bearing == 348.75 || bearing <= 11.25){
				direction = "N";
			}else if(bearing >= 11.25 && bearing <= 33.75){
				direction = "NNE";
			}else if(bearing >= 33.76 && bearing <= 56.25){
				direction = "NE";
			}else if(bearing >= 56.26 && bearing <= 78.75){
				direction = "ENE";
			}else if(bearing >= 78.76 && bearing <= 101.25){
				direction = "E";
			}else if(bearing >= 101.26 && bearing <= 123.75){
				direction = "ESE";
			}else if(bearing >= 123.76 && bearing <= 146.25){
				direction = "SE";
			}else if(bearing >= 146.26 && bearing <= 168.75){
				direction = "SSE";
			}else if(bearing >= 168.76 && bearing <= 191.25){
				direction = "S";
			}else if(bearing >= 191.26 && bearing <= 213.75){
				direction = "SSW";
			}else if(bearing >= 213.76 && bearing <= 236.25){
				direction = "SW";
			}else if(bearing >= 236.26 && bearing <= 258.75){
				direction = "WSW";
			}else if(bearing >= 258.76 && bearing <= 281.25){
				direction = "W";
			}else if(bearing >= 281.26 && bearing <= 303.75){
				direction = "WNW";
			}else if(bearing >= 303.76 && bearing <= 326.25){
				direction = "NW";
			}else if(bearing >= 26.26 && bearing <= 348.74){
				direction = "NE";
			}
			
			return direction + " ";
		}
	})
	
	.filter("addMph", function(){
		return function(speed){
			return speed + " MPH"
		}
	})
	
	.filter("addFah", function(){
		return function(temp){
			return temp + " F";
		};
	})