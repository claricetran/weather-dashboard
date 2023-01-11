const OpenWeatherKey = "bd9f20ec53ac9e675acad3ce4fc3aa3d";
var city;
var country;
var lat;
var long;
var currDay = dayjs().format("D"); //for 5-day forecast to compare last index day if +4 or +5
console.log(currDay);
var searchEl = document.getElementById("search");
var cityEl = document.getElementById("city");
var tempEl = document.getElementById("currTemp");
var windEl = document.getElementById("currWind");
var humidEl = document.getElementById("currHumid");
var iconEl = document.getElementById("currImage");
var forecastSection = document.getElementById("5forecast");

function generateForecastCards() {
	//example of card in ui-kit framework:
	//  <div>
	//      <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-margin-small">
	//          <h3 class="uk-card-title">Date</h3>
	//          <p>Temp:</p>
	//          <p>Wind:</p>
	//          <p>Humidity:</p>
	//      </div>
	//  </div>
	// generate 5 cards to place weather information
	for (var cards = 1; cards <= 5; cards++) {
		var cardOutDiv = document.createElement("div");
		var cardInDiv = document.createElement("div");
		cardInDiv.setAttribute(
			"class",
			"uk-card uk-card-default uk-card-hover uk-card-body uk-margin-small"
		);
		cardInDiv.setAttribute("id", "day-" + cards);
		cardOutDiv.append(cardInDiv);
		var cardH3 = document.createElement("h3");
		cardInDiv.append(cardH3);
		for (var p = 0; p < 3; p++) {
			var pEl = document.createElement("p");
			cardInDiv.append(pEl);
		}
		forecastSection.append(cardOutDiv);
		// when getting forecast api navigate through contents of cards by childNodes[index]
	}
}

function getCoordinates(cityName) {
	//console.log(cityName);
	var requestGeocodeUrl =
		"http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + OpenWeatherKey;
	fetch(requestGeocodeUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			city = cityName;
			lat = data[0].lat;
			long = data[0].lon;
			console.log(lat + ", " + long);
			showCurrentWeather();
			//showForecastWeather();
		});
}

function showCurrentWeather() {
	// show current weather first with current weather API
	var currentWeatherUrl =
		"https://api.openweathermap.org/data/2.5/weather?lat=" +
		lat +
		"&lon=" +
		long +
		"&appid=" +
		OpenWeatherKey;

	fetch(currentWeatherUrl)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			var today = dayjs().format("M/D/YYYY");

			cityEl.textContent = "Current Weather for " + city + " (" + today + ")";
			iconEl.setAttribute(
				"src",
				"http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
			);
			iconEl.setAttribute("alt", data.weather.description);
			currTemp.textContent = "Temperature: " + data.main.temp + " ℉";
			currWind.textContent = "Wind: " + data.wind.speed + " MPH";
			currHumid.textContent = "Humidity: " + data.main.humidity + "%";
		});
}

function showForecastWeather() {
	// show forecast of next 5 days
	var requestForecastUrl =
		"http://api.openweathermap.org/data/2.5/forecast?lat=" +
		lat +
		"&lon=" +
		long +
		"&appid=" +
		OpenWeatherKey +
		"&units=metric";
	fetch(requestForecastUrl)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			var date = dayjs.unix(data.list[8].dt).format("M/D/YYYY h:mm a");
			// var tempF = data[0].list.main.temp;
			// var wind = data[0].list.wind.speed;
			// var humidity = data[0].list.main.humidity;
			// var iconsrc = data[0].list.weather.icon;
			// var description = data[0].list.weather.description;
			console.log(date);
			// console.log(tempF);
			// console.log(wind);
			// console.log(humidity);
			// console.log(iconsrc);
			// console.log(description);
			// var cardGrid = document.createElement("div");
			// var card = document.createElement("div");
			// card.setAttribute("class", "uk-card uk-card-default uk-card-hover uk-card-body uk-margin-small");
			// var date = document.createElement("h3");
			// date.textContent("("+date+")");
			// var icon = document.createElement("img")
			// icon.setAttribute("src",  "http://openweathermap.org/img/wn/"+iconsrc+"@2x.png");
			// icon.setAttribute("alt", data[0].weather.description);
		});
	// if request if valid then save the object of the place: city-name, (state-name if available), country-name, latitude: number, longitude: number to an object array
	// if the request is already in local storage then there's no need to save.
}

function printHistory() {}

generateForecastCards();

// Get location user submitted for search
searchEl.addEventListener("click", function (event) {
	city = document.getElementById("location").value;
	getCoordinates(city);
});
// TODO: print the history of the searches

// Extra:
// Regular Expression for lat long to implement later.
// var latLongRE = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/;
