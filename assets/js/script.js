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
    
        localStorage.setItem("searchItems", JSON.stringify(storedSearchItems));
    }

    else {
        return;
    }
});