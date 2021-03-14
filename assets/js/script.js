const apiKey = "8a73232fcd06372324159654883c0590";


// When the page first loads, start message is displayed
$().ready(function () {
    $('#start-message').removeClass('hide').append('<h2> Enter city name above to view <br/> current weather & five-day forecast <h2>');
}) 


// ----- When user clicks the search button-------
$(".search-button").on("click", function (event) {

    event.preventDefault();

    $('#error-message').empty().addClass('hide'); //hides error message if displayed and empties it
    $('#start-message').empty().addClass('hide'); //hides landing page message

    var userInput = $(this).siblings("input").val();
    var storedSearchItems = JSON.parse(localStorage.getItem("searchItems"));

    if (userInput) { 
        
        if (storedSearchItems) {
            storedSearchItems.push(userInput);
        }
    
        else {
            storedSearchItems = [];
            storedSearchItems.push(userInput);
        }
        
        getWeather(userInput); //function retrieves weather data and renders it on page

        localStorage.setItem("searchItems", JSON.stringify(storedSearchItems)); // Puts user input into local storage

        var searchedItemCount = $('#search-history button').length; // Adds the most recent search item (last in array) to search history

        // limits the number of searched items displayed on page to 6 items
        if (searchedItemCount < 7) {
            $('#search-history').prepend($("<button> " + storedSearchItems[storedSearchItems.length - 1] + " </button>")).removeClass('hide');
            $('#search-history').children('button').addClass('searched-item');
        }

        // Deletes a previously searched item from the page to keep item total at 6
        else {
            $('#search-history').prepend($("<button> " + storedSearchItems[storedSearchItems.length - 1] + " </button>")).removeClass('hide');
            $('#search-history').children('button').addClass('searched-item');
            $('#search-history').children().last().remove();
        }

        $("input").val(""); // Clears the search box after search button is clicked
    }

    // If search button is clicked, but there's nothing typed into the search bar, nothing happens
    else {
        return;
    }
});


// ----------When user clicks a city previously searched--------------------
$("#search-history").on("click", function (event) {

    event.preventDefault();

    $('#error-message').empty().addClass('hide'); //hides error message if displayed and empties it

    var target = $( event.target );

    if (target.is('.searched-item')) { //handles the click

        pastUserInput = target.text();
        console.log(pastUserInput);
    }

    getWeather(pastUserInput); //function retrieves weather data and renders it on page
});


// This function retrieves weather data from APIs and renders it on page
// uses fetch two times for two different URLs
function getWeather (userInput) {

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&units=imperial&appid=' + apiKey;

    // First fetch
    fetch(apiUrl)

        .then (function (response) {  
            return response.json() // Turns the response into a JavaScript Object to be used in next .then block
        })

        .then(function (data) {
            console.log("FIRST API CALL >>>>", data);

            // variables for current weather
            var cityName = data.name;
            var currentTemp = Math.floor(data.main.temp);
            var currentHumidity = data.main.humidity;
            var windSpeed = data.wind.speed;

            var latitude = data.coord.lat; //need this data to perform the second fetch
            var longitude = data.coord.lon; //need this data to perform the second fetch

            // Current weather icon
            var currentWeatherIcon = $("<img>") //create new element
            currentWeatherIcon.attr("src" , "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            $('.current-weather-icon').empty();
            $('.current-weather-icon').append(currentWeatherIcon);

            
            // second API url to be fetched
            var uvIndexApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=' + apiKey; //API that contains uv-index
            
            // Creation of the current weather display (minus uv-index)
            $('.city-name-and-date').html(cityName + " (" + moment().format("M/D/YYYY") + ")");
            $('.current-temp').html("Temperature: " + currentTemp + " <span>&#176;</span>" + "F");
            $('.current-humidity').html("Humidity: " + currentHumidity + "%");
            $('.wind-speed').html("Wind Speed: " + windSpeed + " MPH");
            $('.weather-result').removeClass('hide');

            //Second fetch ---> This fetches new API URL that contains uv-index
            return fetch(uvIndexApiUrl)

            })
        
        .then (function (response) {
            return response.json() //Turns reponse into a JavaScript object to be used in next .then block
        })

        .then (function (data) {
            console.log("SECOND API CALL >>>>", data);

            var uvIndex = data.current.uvi;
            
            $('.uv-index').html("UV Index: ").append('<span></span>'); // creates a new <span> element that will contain the uv-index number

            setUvIndexColor(uvIndex); //function changes background color of uv-index

            renderForecast(data) // function that creates the five-day forecast

        })

        // If user types invalid city, error message displays
        .catch (function (error){
            $('.weather-result').addClass('hide');
            $('#search-history').children().first().remove();
            $('#error-message').empty()
            .append("<h3> Unable to find city. Please check for spelling errors and try again.</h3>")
            .removeClass('hide');
            return;
    })   
};


// The background color of the UV-Index changes based on severity
function setUvIndexColor (uvIndex) {

    if (uvIndex >= 11) {
        $('.uv-index span').html(uvIndex).css('background-color' , 'violet');
    }

    else if ((uvIndex < 11) && (uvIndex >= 8)) {
        $('.uv-index span').html(uvIndex).css({'color': 'white' , 'background':'red'});
    }

    else if ((uvIndex < 8) && (uvIndex >= 6)) {
        $('.uv-index span').html(uvIndex).css('background-color' , 'orange');
    }

    else if ((uvIndex < 6) && (uvIndex >= 3)) {
        $('.uv-index span').html(uvIndex).css('background-color' , 'yellow');
    }

    else {
        $('.uv-index span').html(uvIndex).css({'color': 'white' , 'background':'green'});
    }
};


// Creates the five day forecast
function renderForecast (data) {

    var dateLine = $('.forecast-date');
    var todayDate = moment();
    var index = 0


    dateLine.each(function () { //displays the date, icon, temp, and humidity for each blue box
        
        var forecastDate = todayDate.add(1, 'days').format("M/D/YYYY");
        var forecastTemp = Math.floor((data.daily[index].temp.max));
        var forecastHumidity = (data.daily[index].humidity);

        var forecastIcon = $("<img>") //creates new element
        forecastIcon.attr("src" , "https://openweathermap.org/img/w/" + data.daily[index].weather[0].icon + ".png");

        $(this).html(forecastDate)
        .siblings('.forecast-temp').html("Temp: " + forecastTemp + " <span>&#176;</span>" + "F")
        .siblings('.forecast-humidity').html("Humidity: " + forecastHumidity + "%")
        .siblings('.forecast-icon').empty().append(forecastIcon);

        index ++;
    });
};
