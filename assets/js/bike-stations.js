var stationEl = document.querySelector('#bike-stations');

var getBikeStationId = function () {
    // grab station id from url query string
    var queryString = document.location.search;
    var bikeStationId = queryString.split("=")[1];

    if (bikeStationId) {
        getBikeStations(bikeStationId);
    }
    else {
        // if no station id was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};

var getBikeStations = function (bikeStationId) {

    // City Bikes Station api url
    var apiCityBikeStationUrl = "http://api.citybik.es/v2/networks/" + bikeStationId; //--- Use this url for specific bike station information

    fetch(apiCityBikeStationUrl)
        .then(function (cityBikeStationResponse) {
            return cityBikeStationResponse.json();
        })
        .then(function (cityBikeStationResponse) {

            // Empty Current Bike element for new data
            stationEl.textContent = "";

            // Send bike station information for display
            displayBikeStations(cityBikeStationResponse);

        })
}

// Display relevant bike station data on page
var displayBikeStations = function (bikeStations) {
    console.log(bikeStations)
    var bikeStationArray = bikeStations.network.stations;


    for (let i = 0; i < bikeStationArray.length; i++) {
        var stationName = bikeStationArray[i].extra.name;
        if (!stationName) {
            stationName = bikeStationArray[i].extra.address
        }
        if (!stationName) {
            stationName = bikeStationArray[i].name
        }

        var timeUpdated = new Date(bikeStationArray[i].timestamp)
        var bikeStationEl = document.createElement('div');

        bikeStationEl.className = "card"
        bikeStationEl.innerHTML = "<div class='card-content'><h2 class='title'>" + stationName + "</h2>" +
            "<p><strong>Available Bikes:</strong> " + bikeStationArray[i].free_bikes + "</p>" +
            "<p><strong>Empty Slots:</strong> " + bikeStationArray[i].empty_slots + "</p>" +
            "<p><strong>Last Updated:</strong> " + (timeUpdated.getMonth() + 1) + "/" + timeUpdated.getDate() + "/" + timeUpdated.getFullYear() + " - " + timeUpdated.getHours() + ":" + timeUpdated.getMinutes() + ":" + timeUpdated.getSeconds().toString() + "</p>" +
            "<p><a href='https://www.google.com/maps/search/?api=1&query=" + bikeStationArray[i].latitude + "," + bikeStationArray[i].longitude + "' target='_blank'>Find on Map</a></p></div>"
        stationEl.appendChild(bikeStationEl);

    }

}

getBikeStationId();