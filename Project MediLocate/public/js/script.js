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
  document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.getElementById('cityInput');
    const findClinicsButton = document.querySelector('button[type="button"]');

    findClinicsButton.addEventListener('click', function () {
        const selectedCity = cityInput.value.trim();
        if (selectedCity) {
            window.location.href = `clinics.html?city=${selectedCity}`;
        } else {
            alert('Please enter a city.');
        }
    });
});

// Function to redirect to the results page based on the city input
function redirectToCity() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.toLowerCase().trim();

  if (city) {
    // Redirect to the results route with the city as a query parameter
    window.location.href = `/results?city=${encodeURIComponent(city)}`;
  } else {
    alert("Please enter a valid city name.");
  }
}

// Example logout function (if needed)
function logout() {
  // Redirect the user to the login page or perform logout logic
  window.location.href = "/Login";
}
  