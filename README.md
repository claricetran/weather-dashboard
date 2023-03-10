# Weather Dashboard

## Description

This is a weather dashboard which presents the user with a way to view the current weather and 5-day weather forecast. This dashboard uses CSS Framework from UI Kit, so no css file had to be made here. It also utilizes Day.js to format unix times. To get the weather data based off of the name of the city, 3 data sets from Open Weather API were used.

## Installation

To reach this weather dashboard, the user just has to go to the site [here](https://claricetran.github.io/weather-dashboard/).

## Usage

Upon loading the weather dashboard, the user is given instructions to put a city into the search bar. The user must click the button in order for the page to return the weather data.
Once clicked, the weather data is displayed in the main section to show the current weather and a 5-day weather forecast. If the searched city is a new search then it will be saved below the search bar and can be clicked on to load the weather data for that city conveniently.
![Dashboard usability](https://github.com/claricetran/weather-dashboard/blob/main/assets/images/WeatherDashboardUsability.gif)

Page reload after searching cities.

![On page reload after searching cities](https://github.com/claricetran/weather-dashboard/blob/main/assets/images/WeatherDashboardUsabilityPageReload.gif)

## Credits

[Open Weather API](https://openweathermap.org/api)

-   [OW Current Weather Data](https://openweathermap.org/current)
-   [OW Geocoding API](https://openweathermap.org/api/geocoding-api)
-   [OW 5 Day / 3 hour Forecast Data](https://openweathermap.org/api/geocoding-api)

[Day.js](https://day.js.org/en/)

[UI Kit for CSS Framework](https://getuikit.com/docs/introduction)

## License

MIT License

Copyright (c) 2023 Clarice Tran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
