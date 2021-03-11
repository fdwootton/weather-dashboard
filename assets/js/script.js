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

    var apiKey = "8a73232fcd06372324159654883c0590";
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

            // getUvIndex();

            // var currentDate = moment()format
            $('.city-name').html(cityName);
            $('.current-temp').html("Temperature: " + currentTemp + "<span>&#176;</span>" + "F");
            $('.current-humidity').html("Humidity: " + currentHumidity + "%");
            $('.wind-speed').html("Wind Speed: " + windSpeed + " MPH");
            $('#weather-container').removeClass('hide');
            })

        .catch (function (err){
            alert("Unable to find city. Please check for spelling errors.");
        })   
};


// function getUvIndex () {

//     var latitude = data.coord.lat;
//     var longitude = data.coord.lon;
//     var uvIndexApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

//     fetch(uvIndexApiUrl)

//         .then (function (response) {
//             return response.json()
//         })

//         .then (function (data) {

//         })
                
            
// }



// For five day forecast:
// api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}


// function displayCurrentWeather () {};
// function getFiveDayForecast () {};
// function displayFiveDayForecast () {};