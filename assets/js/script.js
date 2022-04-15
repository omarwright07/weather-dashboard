var weatherIcons = {
    sunny: "oi oi-sun",
    partlyCloudy: "oi oi-cloud",
    mostlyCloudy: "oi oi-cloudy",
    rainy: "oi oi-rain",
    stormy: "oi oi-bolt",
};
var cityName = "";
var searchHistory = [];
var apiKey = "a90b37582c4f712e55eb4bd2432a468a"

// ###########################################################
// ###########################################################

// var saveTimeBlock = function (id) {
//     console.log("Saving...")
//     localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
// };

// var loadTimeBlocks = function () {
//     var savedtimeBlocks = JSON.parse(localStorage.getItem("searchHistory"));

//     // if nothing in localStorage, create a new object to track all description
//     if (!savedtimeBlocks) {
//         console.log("There was no local save! Setting default values!");
//         for (i = 0; i < timeBlocksLength; i++) {
//             setTimeBlocksText();
//         }
//     } else {
//         console.log("Loaded from local save!")
//         timeBlocks = JSON.parse(localStorage.getItem("timeBlocks"));
//         setTimeBlocksText();
//     }
// };

// Generate Forecast Functions ____________________________________
var generateForecast = function () {
    console.log("Generating Forecast...")
    cityName = $("#search").val();
    if (cityName == "") {
        cityName = $("#search").attr("placeholder");
    }
    console.log(cityName);
    fetchWeatherInfo();
};




var clearForecastSection = function () {
    console.log("Removing Forecasts...");
    $("#current-forecast").remove();
    $("#future-forecast").remove();
};

var fetchWeatherInfo = function () {
    var apiForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    console.log(apiForecastURL);
    fetch(apiForecastURL)
        .then(function (responseForecast) {
            // request was successful
            if (responseForecast.ok) {
                responseForecast.json().then(function (dataForecast) {
                    console.log(dataForecast);
                    var cityLat = dataForecast.city.coord.lat;
                    var cityLon = dataForecast.city.coord.lon;
                    var apiCurrentURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly,minutely,alerts&appid=" + apiKey + "&units=imperial";
                    // requesting all weather data
                    fetch(apiCurrentURL)
                        .then(function (responseCurrent) {
                            if (responseCurrent.ok) {
                                responseCurrent.json().then(function (dataCurrent) {
                                    console.log(apiCurrentURL);
                                    console.log(dataCurrent);
                                    clearForecastSection();
                                    createTodayForecast(dataCurrent, dataForecast.city.name);
                                    createFutureForecast(dataCurrent);
                                    if (!searchHistory.includes(dataForecast.city.name)) {
                                    createSearchBTN(dataForecast.city.name);
                                    }
                                })
                            };
                        })
                });
            } else {
                alert('Error: Location Not Found');
                console.log(response);
            }
        })
        // unable to connect to OpenWeather
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

var createTodayForecast = function (data, city) {
    console.log("Creating Current Forecast...");
    var date = moment(data.daily[0].dt * 1000).format("MM.DD.YYYY");

    var todaySectionEl = $("<section>")
        .attr("id", "current-forecast")
        .addClass("current");

    var todayHeadingEl = $("<h2>")
        .addClass("bold")
        .text(city + " (" + date + ") ");
    // Weather Icon
    var todayHeadingIconEl = $("<span>");
    switch (data.daily[0].weather[0].icon) {
        case "02d": case "03d":
            todayHeadingIconEl.addClass(weatherIcons.partlyCloudy);
            break;
        case "04d":
            todayHeadingIconEl.addClass(weatherIcons.mostlyCloudy);
            break;
        case "09d": case "10d": case "13d":
            todayHeadingIconEl.addClass(weatherIcons.rainy);
            break;
        case "11d":
            todayHeadingIconEl.addClass(weatherIcons.stormy);
            break;
        default:
            todayHeadingIconEl.addClass(weatherIcons.sunny);
    }

    var todayUlEl = $("<ul>");

    // Day Details
    var todayTempEl = $("<li>")
        .text("Temp: " + data.daily[0].temp.day + " \u00B0F");
    var todayWindEl = $("<li>")
        .text("Wind: " + data.daily[0].wind_speed + " MPH");
    var todayHumidityEl = $("<li>")
        .text("Humidity: " + data.daily[0].humidity + " %");
    var todayUVIndexEl = $("<li>")
        .text("UV Index: ");
    var todayUVIconEl = $("<span>")
        .text(data.daily[0].uvi);

    // Checking the UV Index rating
    if (data.daily[0].uvi < 3) {
        todayUVIconEl.addClass("uvindex-favorable");
    } else if (data.daily[0].uvi > 6) {
        todayUVIconEl.addClass("uvindex-severe");
    } else {
        todayUVIconEl.addClass("uvindex-moderate");
    }

    // Append Elements
    todayUVIndexEl.append(todayUVIconEl);
    todayUlEl.append(todayTempEl, todayWindEl, todayHumidityEl, todayUVIndexEl);
    todayHeadingEl.append(todayHeadingIconEl);
    todaySectionEl.append(todayHeadingEl, todayUlEl);
    $("#forecast").append(todaySectionEl);
};

var createFutureForecast = function (data) {
    var futureSectionEl = $("<section>")
        .attr("id", "future-forecast")
        .addClass("mt-4");

    var futureHeadingEl = $("<h3>")
        .addClass("bold")
        .text("5-Day Forecast:");

    var futureDaysContainerEl = $("<div>")
        .addClass("row");

    // Append Elements
    futureSectionEl.append(futureHeadingEl, futureDaysContainerEl);
    $("#forecast").append(futureSectionEl);

    // Generate the 5-Day Forecast
    for (var i = 0; i < 5; i++) {
        var date = moment(data.daily[i + 1].dt * 1000).format("MM.DD.YYYY");

        var dayContainerEl = $("<div>")
            .addClass("daysforecast col d-flex flex-column align-items-center");

        var dayHeaderEl = $("<h4>")
            .addClass("center")
            .text(date);

        // Weather Icon
        var dayIconEl = $("<span>");
        switch (data.daily[i + 1].weather[0].icon) {
            case "02d": case "03d":
                dayIconEl.addClass("icon" + " " + weatherIcons.partlyCloudy);
                break;
            case "04d":
                dayIconEl.addClass("icon" + " " + weatherIcons.mostlyCloudy);
                break;
            case "09d": case "10d": case "13d":
                dayIconEl.addClass("icon" + " " + weatherIcons.rainy);
                break;
            case "11d":
                dayIconEl.addClass("icon" + " " + weatherIcons.stormy);
                break;
            default:
                dayIconEl.addClass("icon" + " " + weatherIcons.sunny);
        }

        var dayDetailsContainerEl = $("<div>")
            .addClass("d-flex flex-column align-items-start")

        // Day Details
        var dayTempEl = $("<p>")
            .text("Temp: " + data.daily[i + 1].temp.day + " \u00B0F");
        var dayWindEl = $("<p>")
            .text("Wind " + data.daily[i + 1].wind_speed + " MPH");
        var dayHumidityEl = $("<p>")
            .text("Humidity: " + data.daily[i + 1].humidity + " %");

        // Append Elements
        dayDetailsContainerEl.append(dayTempEl, dayWindEl, dayHumidityEl);
        dayContainerEl.append(dayHeaderEl, dayIconEl, dayDetailsContainerEl);
        futureDaysContainerEl.append(dayContainerEl);
    }
};

var createSearchBTN = function (location) {
    console.log("Creating Search Button...");
    var searchHistoryBTN = $("<button>")
        .addClass("search-btn-history")
        .text(location);
    $("#search-history").append(searchHistoryBTN);
    searchHistory.push(location);
    console.log(searchHistory);
};

// ###########################################################
// ###########################################################

$(".search-btn").on("click", generateForecast);
// $("#search-history").on("click", function (event) {
//     console.log("click");
//     console.log(event.target.innerHTML);
// });

$("#search-history").on("click", ".search-btn-history", function (event) {
    console.log("click");
    console.log(event.target.innerHTML);
});