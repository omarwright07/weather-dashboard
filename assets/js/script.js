var weatherIcons = {
    sunny: "oi oi-sun",
    partlyCloudy: "oi oi-cloud",
    mostlyCloudy: "oi oi-cloudy",
    rainy: "oi oi-rain",
    stormy: "oi oi-bolt",
};

var searchHistory = [];
// ###########################################################
// ###########################################################

// Generate Forecast Functions ____________________________________
var generateForecast = function () {
    console.log("Generating Forecast...")
    clearForecastSection();
    createTodayForecast();
    createFutureForecast();
    createSearchBTN();
    console.log("Forecast finished!!");
};

var clearForecastSection = function () {
    console.log("Removing Forecasts...");
    $("#current-forecast").remove();
    $("#future-forecast").remove();
}

var createTodayForecast = function () {
    console.log("Creating Current Forecast...");

    var todaySectionEl = $("<section>")
        .attr("id", "current-forecast")
        .addClass("current");

    var todayHeadingEl = $("<h2>")
        .addClass("bold")
        .text("Austin (3/30/2021) ");
    // Weather Icon
    var todayHeadingIconEl = $("<span>")
        .addClass(weatherIcons.sunny);

    var todayUlEl = $("<ul>");

    // Day Details
    var todayTempEl = $("<li>")
        .text("Temp: 74.01 \u00B0F");
    var todayWindEl = $("<li>")
        .text("Wind: 6.67 MPH");
    var todayHumidityEl = $("<li>")
        .text("Humidity: 46 %");
    var todayUVIndexEl = $("<li>")
        .text("UV Index: ");
    var todayUVIconEl = $("<span>")
        .addClass("uvindex-favorable")
        .text("0.47");

    // Append Elements
    todayUVIndexEl.append(todayUVIconEl);
    todayUlEl.append(todayTempEl, todayWindEl, todayHumidityEl, todayUVIndexEl);
    todayHeadingEl.append(todayHeadingIconEl);
    todaySectionEl.append(todayHeadingEl, todayUlEl);
    $("#forecast").append(todaySectionEl);
};

var createFutureForecast = function () {
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
        console.log("create future forecast" + i);

        var dayContainerEl = $("<div>")
            .addClass("daysforecast col d-flex flex-column align-items-center");

        var dayHeaderEl = $("<h4>")
            .addClass("center")
            .text("3/31/2021");
        // Weather Icon
        var dayIconEl = $("<span>")
            .addClass("icon" + " " + weatherIcons.rainy);

        var dayDetailsContainerEl = $("<div>")
            .addClass("d-flex flex-column align-items-start")

        // Day Details
        var dayTempEl = $("<p>")
            .text("Temp: 74.01 \u00B0F");
        var dayWindEl = $("<p>")
            .text("Wind 9.53 MPH");
        var dayHumidityEl = $("<p>")
            .text("Humidity: 66%");

        // Append Elements
        dayDetailsContainerEl.append(dayTempEl, dayWindEl, dayHumidityEl);
        dayContainerEl.append(dayHeaderEl, dayIconEl, dayDetailsContainerEl);
        futureDaysContainerEl.append(dayContainerEl);
    }
};

var createSearchBTN = function () {
    console.log("Creating Search Button...");
    var searchHistoryBTN = $("<button>")
        .addClass("search-btn-history")
        .text("test");
    $("#search-history").append(searchHistoryBTN);
};

// ###########################################################
// ###########################################################

$(".search-btn").on("click", generateForecast);