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
        
        // Puts user input into local storage
        localStorage.setItem("searchItems", JSON.stringify(storedSearchItems));

        // Adds the most recent search item (last in array) to the "Search Again:" line on the page
        $('#search-history').append($("<button> " + storedSearchItems[storedSearchItems.length - 1] + " </button>")).removeClass('hide');;

        getCurrentWeather(userInput);
        
        // Clears the search box after search button is clicked
        $("input").val(""); 
    }

    // If search button is clicked, but there's nothingg typed into the search bar, nothing happens
    else {
        return;
    }
});


// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// Your API key is 8a73232fcd06372324159654883c0590

function getCurrentWeather (userInput) {

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&appid=8a73232fcd06372324159654883c0590';
  
    fetch(apiUrl)
//         .then(function (response) {
//             if (response.ok) {
//             console.log(response);
    //       response.json().then(function (data) {
    //         console.log(data);
    //         displayCurrentWeather(data, user);
    //       });
    //     } else {
    //       alert('Error: ' + response.statusText);
    //     }
    //   })
    //   .catch(function (error) {
    //     alert('Unable to connect to find city. Please check for spelling errors.');
    //   });
};


// function displayCurrentWeather () {};
// function getFiveDayForecast () {};
// function displayFiveDayForecast () {};

