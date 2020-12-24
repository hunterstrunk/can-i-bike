var today = new Date();
var WeatherEl = document.querySelector('#weather');
var cityNameInputEl = document.querySelector("#city-name");
var cityFormEl = document.querySelector("#city-form");

var formSubmitHandler = function (event) {
    event.preventDefault();
    // get city name value from input element
    var cityname = cityNameInputEl.value.trim();

    // Set city name in local storage and generate history buttons
    if (cityname) {
        getWeatherInfo(cityname);
        cityNameInputEl.value = "";
    }
    else {
        alert("Please enter a City name");
    }

}


var getWeatherInfo = function (cityname) {
    var apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";
    fetch(
        // Make a fetch request using city name to get latitude and longitude for city
        apiCityUrl
    )
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(function (cityResponse) {
            // console.log(cityResponse)

            // Create variables to hold the latitude and longitude of requested city
            var latitude = cityResponse.coord.lat;
            var longitude = cityResponse.coord.lon;


            // Empty Current Weather element for new data
            WeatherEl.textContent = "";

            // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (weatherResponse) {
            // return response in json format
            return weatherResponse.json();
        })
        .then(function (weatherResponse) {
            // console.log(weatherResponse);

            // send response data to displayWeather function for final display 
            displayWeather(weatherResponse);

        });
};


// Display the weather on page
var displayWeather = function (weather) {
    var dateToday = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    var cardEl = document.createElement("div");
    cardEl.className = "card";
    var currentDayEl = document.createElement("div");
    currentDayEl.className = "card-content";

    // check if api returned any weather data
    if (weather.length === 0) {
        weatherEl.textContent = "No weather data found.";
        return;
    }
    // Create Temperature element
    var dateEl = document.createElement('h4');
    dateEl.className = "title is-4"
    dateEl.innerHTML = dateToday;
    currentDayEl.appendChild(dateEl);

    var temperature = document.createElement('p');
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentDayEl.appendChild(temperature);

    // Create Humidity element
    var humidity = document.createElement('p');
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    currentDayEl.appendChild(humidity);

    // Create Wind Speed element
    var windSpeed = document.createElement('p');
    windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
    currentDayEl.appendChild(windSpeed);

    // Create uv-index element
    var uvIndex = document.createElement('p');
    var uvIndexValue = weather.current.uvi.toFixed(1);
    if (uvIndexValue >= 0) {
        uvIndex.className = "uv-index-green"
    }
    if (uvIndexValue >= 3) {
        uvIndex.className = "uv-index-yellow"
    }
    if (uvIndexValue >= 8) {
        uvIndex.className = "uv-index-red"
    }
    uvIndex.innerHTML = "<strong>UV Index:</strong> <span>" + uvIndexValue + "</span>";
    currentDayEl.appendChild(uvIndex);

    cardEl.appendChild(currentDayEl);
    WeatherEl.appendChild(cardEl);


    // Get extended forecast data
    var forecastArray = weather.daily;

    // Create day cards for extended forecast
    for (let i = 0; i < forecastArray.length; i++) {
        var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
        var weatherIcon = forecastArray[i].weather[0].icon;
        var weatherDescription = forecastArray[i].weather[0].description;
        var weatherIconLink = "<img style='margin: -15px 0' src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
        var futureCardEl = document.createElement("div");
        futureCardEl.className = "card";
        var dayContentEl = document.createElement("div");
        dayContentEl.className = "card-content";
        dayContentEl.innerHTML = "<h5 class='title is-5'>" + date + "</h5><div class='columns'>" +
            "<div class='column'><p class='image is-64x64'>" + weatherIconLink + "</p></div>" +
            "<div class='column'><p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
            "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p></div></div>";
        var dayFooterEl = document.createElement("div");
        dayFooterEl.className = "card-footer"
        dayFooterEl.innerHTML = ""

        futureCardEl.appendChild(dayContentEl);
        WeatherEl.appendChild(futureCardEl);

    }

}

var getMap = function (cityName) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: -34.397, lng: 150.644 },
        zoom:8,
    });
}

cityFormEl.addEventListener("submit", formSubmitHandler);