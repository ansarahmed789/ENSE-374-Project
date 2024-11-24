document.addEventListener("DOMContentLoaded", function () {
    const cities = ["Regina", "Moose Jaw", "Saskatoon"];
    const cityInput = document.getElementById("cityInput");
    const suggestions = document.getElementById("suggestions");
  
    cityInput.addEventListener("input", function () {
      const inputValue = cityInput.value.toLowerCase();
      suggestions.innerHTML = "";
  
      if (inputValue.length > 0) {
        const filteredCities = cities.filter((city) =>
          city.toLowerCase().startsWith(inputValue)
        );
  
        if (filteredCities.length > 0) {
          filteredCities.forEach((city) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("dropdown-item");
            suggestionItem.textContent = city;
            suggestionItem.addEventListener("click", function () {
              cityInput.value = city;
              suggestions.innerHTML = "";
            });
            suggestions.appendChild(suggestionItem);
          });
  
          suggestions.classList.add("show");
        } else {
          suggestions.classList.remove("show");
        }
      } else {
        suggestions.classList.remove("show");
      }
    });
  
    document.addEventListener("click", function (event) {
      if (event.target !== cityInput) {
        suggestions.classList.remove("show");
      }
    });
  });
  