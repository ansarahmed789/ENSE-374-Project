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
function redirectToCity() {
    const city = document.getElementById('cityInput').value.trim().toLowerCase();

    if (city === 'regina') {
        window.location.href = 'Regina.html';
    } else if (city === 'moose jaw') {
        window.location.href = 'MJ.html';
    } else if (city === 'saskatoon') {
        window.location.href = 'Saskatoon.html';
    } else {
        alert("Please enter a valid city: Regina, Moose Jaw, or Saskatoon.");
    }
}

  