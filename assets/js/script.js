const apiKey = "8a73232fcd06372324159654883c0590";

// ----- When user clicks the search button-------
$(".search-button").on("click", function (event) {
    event.preventDefault();

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
        
        getCurrentWeather(userInput);

        // Puts user input into local storage
        localStorage.setItem("searchItems", JSON.stringify(storedSearchItems));

        // Adds the most recent search item (last in array) to the "Search Again:" line on the page
        $('#search-history').append($("<button> " + storedSearchItems[storedSearchItems.length - 1] + " </button>")).removeClass('hide');;

        
        // Clears the search box after search button is clicked
        $("input").val(""); 
    }

    // If search button is clicked, but there's nothing typed into the search bar, nothing happens
    else {
        return;
    }
});


// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API key is 8a73232fcd06372324159654883c0590

function getCurrentWeather (userInput) {

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&units=imperial&appid=' + apiKey;

    fetch(apiUrl)

        .then (function (response) {
            // Turns the response into a JavaScript Object
            return response.json() 
        })

        .then(function (data) {
            console.log(data);

            var cityName = data.name;
            var currentTemp = data.main.temp;
            var currentHumidity = data.main.humidity;
            var windSpeed = data.wind.speed;
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            var currentWeatherIcon = $("<img>")
            currentWeatherIcon.attr("src" , "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            $('.current-weather-icon').empty();
            $('.current-weather-icon').append(currentWeatherIcon);
            

            var uvIndexApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey; //API that contains uv-index
            
            $('.city-name-and-date').html(cityName + " (" + moment().format("M/D/YYYY") + ")");
            $('.current-temp').html("Temperature: " + currentTemp + " <span>&#176;</span>" + "F");
            $('.current-humidity').html("Humidity: " + currentHumidity + "%");
            $('.wind-speed').html("Wind Speed: " + windSpeed + " MPH");
            $('.weather-result').removeClass('hide');

            // This fetches API that contains uv-index
            return fetch(uvIndexApiUrl)

            })

            
            
        
        .then (function (response) {
            return response.json()
        })

        .then (function (data) {
            console.log(data);

            var uvIndex = data.current.uvi;
            $('.uv-index').html("UV Index: ").append('<span></span>');

            setUvIndexColor(uvIndex);
        })

        .catch (function (error){
            alert("Unable to find city. Please check for spelling errors.");
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
        $('.uv-index span').html(uvIndex).css('background-color' , 'green');
    }
}

// For five day forecast:
// api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}


// function displayCurrentWeather () {};
// function getFiveDayForecast () {};
// function displayFiveDayForecast () {};