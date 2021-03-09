

$(".search-button").on("click", function (event) {
    event.preventDefault();
    var userInput = $(this).siblings("input").val();
    localStorage.setItem("searchItem", userInput);
})
