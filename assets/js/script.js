
// ----- When user clicks the search button-------
$(".search-button").on("click", function (event) {
    event.preventDefault();

    var userInput = $(this).siblings("input").val();
    var storedSearchItems = localStorage.getItem("searchItems");

    // if (userInput) {
    //     localStorage.setItem("searchItem", userInput);
    // }

    // else {
    //     return;
    // }

    if (storedSearchItems) {
        storedSearchItems.push(userInput);
    }

    else {
        storedSearchItems = [];
        storedSearchItems.push(userInput);
    }

    localStorage.setItem("searchItems", JSON.stringify(storedSearchItems));
});