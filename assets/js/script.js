const OpenWeatherKey = "bd9f20ec53ac9e675acad3ce4fc3aa3d";
var city;
var state;
var country;
var lat;
var long;
var currDay = dayjs().format("D"); //for 5-day forecast to compare last index day if +4 or +5
var searchEl = document.getElementById("search");
var userInputCity = document.getElementById("input");
var cityEl = document.getElementById("city");
var tempEl = document.getElementById("currTemp");
var windEl = document.getElementById("currWind");
var humidEl = document.getElementById("currHumid");
var iconEl = document.getElementById("currImage");
var forecastSection = document.getElementById("5forecast");
var historyEl = document.getElementById("prevSearch");

function init() {
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
			"uk-card uk-card-default uk-card-hover uk-card-body uk-margin-small uk-light"
		);
		cardInDiv.setAttribute("id", "day-" + cards);
		cardOutDiv.append(cardInDiv);
		cardInDiv.setAttribute("style", "background-color: rgba(0, 212, 255);");
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

	// Generates previous search history from local save if storedCities as buttons if save isn't empty
	var storedCities = JSON.parse(localStorage.getItem("cities"));
	if (storedCities !== null && storedCities.length > 0) {
		storedCities.forEach((c) => {
			createPreviousSearchButton(c);
		});
	}
}

function saveCity(location) {
	var cities = [];
	var storedCities = JSON.parse(localStorage.getItem("cities"));
	// if the cities storage has data then fill the cities array with the stored cities
	if (storedCities !== null && storedCities.length > 0) {
		cities = storedCities.slice();
	}
	if (!cities.includes(location)) {
		var locationObject = {
			city: city,
			state: state,
			country: country,
			latitude: lat,
			longitude: long,
		};
		cities.push(location);
		localStorage.setItem(location, JSON.stringify(locationObject));
		localStorage.setItem("cities", JSON.stringify(cities));
		createPreviousSearchButton(location);
	}
}

// creates a button with click event listener to
function createPreviousSearchButton(loc) {
	var buttonEl = document.createElement("button");
	buttonEl.setAttribute("type", "button");
	buttonEl.setAttribute(
		"class",
		"uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom history"
	);
	buttonEl.textContent = loc;
	buttonEl.addEventListener("click", function () {
		var locObject = JSON.parse(localStorage.getItem(loc));
		city = locObject.city;
		country = locObject.country;
		if (country == "US") {
			state = locObject.state;
		} else {
			state = "";
		}
		lat = locObject.latitude;
		long = locObject.longitude;
		showCurrentWeather();
		showForecastWeather();
	});
	historyEl.prepend(buttonEl);
}

// show current weather with current weather API
function showCurrentWeather() {
	var currentWeatherUrl =
		"https://api.openweathermap.org/data/2.5/weather?lat=" +
		lat +
		"&lon=" +
		long +
		"&appid=" +
		OpenWeatherKey +
		"&units=imperial";
	var location = "";
	fetch(currentWeatherUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			var today = dayjs().format("M/D/YYYY");
			if (country == "US") {
				location = city + ", " + state;
			} else {
				location = city + ", " + country;
			}
			cityEl.textContent = "Current Weather for " + location + " (" + today + ")";
			iconEl.setAttribute(
				"src",
				"https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
			);
			iconEl.setAttribute("alt", data.weather.description);
			currTemp.textContent = "Temperature: " + data.main.temp + " ℉";
			currWind.textContent = "Wind: " + data.wind.speed + " MPH";
			currHumid.textContent = "Humidity: " + data.main.humidity + "%";
		});
}

// show forecast of next 5 days
function showForecastWeather() {
	var requestForecastUrl =
		"https://api.openweathermap.org/data/2.5/forecast?lat=" +
		lat +
		"&lon=" +
		long +
		"&appid=" +
		OpenWeatherKey +
		"&units=imperial";
	fetch(requestForecastUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			var startIndex = 0;
			// forecast API returns a list of 40 forecast data for every 3 hours from the next valid hour that is upcoming.
			// When the next hour is 12 AM, then the index should start at 0.
			// If last day index is not 4 days away, the forecast of the next day needs to be found in the next 8 indexes because 0 still shows data for the current day.
			if (
				dayjs.unix(data.list[data.list.length - 1].dt).format("D") !=
				dayjs().add(4, "day").format("D")
			) {
				var searchIndex = 0;
				while (startIndex == 0) {
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
			var dayID = 1;
			for (startIndex; startIndex < data.list.length; startIndex += 8) {
				var card = document.getElementById("day-" + dayID).childNodes;
				card[0].textContent = dayjs.unix(data.list[startIndex].dt).format("M/D/YYYY");
				card[1].setAttribute(
					"src",
					"https://openweathermap.org/img/wn/" +
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

// Gets lat, long based off of a city namee
function getCoordinates(cityName) {
	var requestGeocodeUrl =
		"https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + OpenWeatherKey;
	fetch(requestGeocodeUrl)
		.then(function (response) {
			if (response.status == 200) {
				response.json().then(function (data) {
					if (Object.keys(data).length > 0) {
						city = data[0].name;
						lat = data[0].lat;
						long = data[0].lon;
						country = data[0].country;
						if (country == "US") {
							state = data[0].state;
							saveCity(city + ", " + state);
						} else {
							state = "";
							saveCity(city + ", " + country);
						}
						showCurrentWeather();
						showForecastWeather();
					} else {
						cityEl.textContent =
							"Invalid input. Please enter a valid city to view the weather there.";
						clearWeather();
					}
				});
			}
		})
		.catch(function (error) {
			cityEl.textContent = "Unable to load weather information.";
		});
	userInputCity.value = "";
}

init();

// Get location user submitted for search
searchEl.addEventListener("click", function (event) {
	city = userInputCity.value;
	getCoordinates(city);
});

// Extra for later:
// Regular Expression for lat long to implement later.
// var latLongRE = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/;
