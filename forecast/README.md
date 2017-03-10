# Forecast App

### Summary
The point of the app is to provide accurate 
weather for various locations.

### Instructions
1. Load the webpage
2. Find your city from the dropdown list
3. Choose your city and watch the magic happen

### Code

I had some problems with this project. The largest one was with the cocept of <br>
Asynchronous programming.

```
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
		   
```

I thought that that may be a reason for why my program was breaking, but I <br>
initially ruled it out thinking that asynchronous programming problems were <br>
specifically due to calling API's from the web rather than a local file. <br>
Luckily Dr. Babb was present to explain this to me.