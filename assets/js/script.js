const OpenWeatherKey = "bd9f20ec53ac9e675acad3ce4fc3aa3d";
var city;
var lat;
var long;
var currDay = dayjs().format("D"); //for 5-day forecast to compare last index day if +4 or +5
console.log("current day: " + currDay);
var searchEl = document.getElementById("search");
var cityEl = document.getElementById("city");
var tempEl = document.getElementById("currTemp");
var windEl = document.getElementById("currWind");
var humidEl = document.getElementById("currHumid");
var iconEl = document.getElementById("currImage");
var forecastSection = document.getElementById("5forecast");
var historyEl = document.getElementById("prevSearch");

// generate 5 cards to place weather information
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
	for (var cards = 1; cards <= 5; cards++) {
		var cardOutDiv = document.createElement("div");
		var cardInDiv = document.createElement("div");
		cardInDiv.setAttribute(
			"class",
			"uk-card uk-card-default uk-card-hover uk-card-body uk-margin-small uk-background-muted"
		);
		cardInDiv.setAttribute("id", "day-" + cards);
		cardOutDiv.append(cardInDiv);
		var cardH3 = document.createElement("h3");
		cardInDiv.append(cardH3);
		var cardImg = document.createElement("img");
		cardInDiv.append(cardImg);
		for (var p = 0; p < 3; p++) {
			var pEl = document.createElement("p");
			cardInDiv.append(pEl);
		}
		forecastSection.append(cardOutDiv);
	}
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
			return response.json();
		})
		.then(function (data) {
			var today = dayjs().format("M/D/YYYY");
			cityEl.textContent =
				"Current Weather for " + city + ", " + data.sys.country + " (" + today + ")";
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
			var startIndex = 0;
			// forecast API returns a list of 40 forecast data for every 3 hours from the next valid hour that is upcoming.
			// When the next hour is 12 AM, then the index should start at 0.
			console.log(data.list[data.list.length - 1].dt);
			console.log(
				"Last Index Day: " + dayjs.unix(data.list[data.list.length - 1].dt).format("D")
			);
			console.log(dayjs().add(4, "day").format("D"));
			// If last day index is not 4 days away, the forecast of the next day needs to be found in the next 8 indexes because 0 still shows data for the current day.
			if (
				dayjs.unix(data.list[data.list.length - 1].dt).format("D") !=
				dayjs().add(4, "day").format("D")
			) {
				var searchIndex = 0;
				while (startIndex == 0) {
					console.log(
						"curr Index Day: " +
							dayjs.unix(data.list[searchIndex].dt).format("D") +
							" tomorrow: " +
							dayjs().add(1, "day").format("D")
					);
					if (
						dayjs.unix(data.list[searchIndex].dt).format("D") ==
						dayjs().add(1, "day").format("D")
					) {
						startIndex = searchIndex;
					} else {
						searchIndex++;
					}
				}
			}
			console.log(startIndex);
			var dayID = 1;
			for (startIndex; startIndex < data.list.length; startIndex += 8) {
				var card = document.getElementById("day-" + dayID).childNodes;
				card[0].textContent = dayjs.unix(data.list[startIndex].dt).format("M/D/YYYY");
				card[1].setAttribute(
					"src",
					"http://openweathermap.org/img/wn/" +
						data.list[startIndex].weather[0].icon +
						"@2x.png"
				);
				card[1].setAttribute("alt", data.list[startIndex].weather.description);
				card[2].textContent = "Temperature: " + data.list[startIndex].main.temp + " ℉";
				card[3].textContent = "Wind: " + data.list[startIndex].wind.speed + " MPH";
				card[4].textContent = "Humidity: " + data.list[startIndex].main.humidity + " %";
				dayID++;
			}
		});
	// if request if valid then save the object of the place: city-name, (state-name if available), country-name, latitude: number, longitude: number to an object array
	// if the request is already in local storage then there's no need to save.
}

// Clears out all listed weather data
function clearWeather() {
	iconEl.setAttribute("src", "");
	iconEl.setAttribute("alt", "");
	currTemp.textContent = "";
	currWind.textContent = "";
	currHumid.textContent = "";
	for (var c = 1; c <= 5; c++) {
		var card = document.getElementById("day-" + c).childNodes;
		card[0].textContent = "";
		card[1].setAttribute("src", "");
		card[1].setAttribute("alt", "");
		card[2].textContent = "";
		card[3].textContent = "";
		card[4].textContent = "";
	}
}

function getCoordinates(cityName) {
	var requestGeocodeUrl =
		"http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + OpenWeatherKey;
	fetch(requestGeocodeUrl)
		.then(function (response) {
			console.log(response);
			if (response.status == 200) {
				response.json().then(function (data) {
					if (Object.keys(data).length > 0) {
						city = cityName;
						lat = data[0].lat;
						long = data[0].lon;
						console.log(lat + ", " + long);
						showCurrentWeather();
						showForecastWeather();
					} else {
						cityEl.textContent =
							"Invalid input. Please enter a 'city', 'city, state', or 'city, country' to view the weather there.";
						clearWeather();
					}
				});
			}
		})
		.catch(function (error) {
			cityEl.textContent = "Unable to load weather information.";
		});
}

// TODO: print the history of the searches
function printHistory() {}

generateForecastCards();

// Get location user submitted for search
searchEl.addEventListener("click", function (event) {
	city = document.getElementById("location").value;
	getCoordinates(city);
});

// Extra:
// Regular Expression for lat long to implement later.
// var latLongRE = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/;
