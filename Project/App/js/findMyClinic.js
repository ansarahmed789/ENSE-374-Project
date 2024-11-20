// Custom JS for Find My Clinic Page

document.addEventListener("DOMContentLoaded", function() {
    const cityInput = document.getElementById('citySearch');
    const clinicList = document.querySelectorAll('#clinicList .col-md-4');
  
    cityInput.addEventListener('input', filterClinics);
  
    function filterClinics() {
      const cityValue = cityInput.value.toLowerCase();
      
      clinicList.forEach(clinic => {
        const clinicCity = clinic.getAttribute('data-city').toLowerCase();
        if (clinicCity.includes(cityValue) || cityValue === '') {
          clinic.style.display = 'block';
        } else {
          clinic.style.display = 'none';
        }
      });
    }
  });
  
  function openServiceDetail(name, description, image) {
    // Set modal title, description, and image
    document.getElementById('serviceDetailLabel').innerText = name;
    document.getElementById('serviceDescription').innerText = description;
    document.getElementById('serviceImage').src = image;
  
    // Show the modal
    var serviceDetailModal = new bootstrap.Modal(document.getElementById('serviceDetailModal'));
    serviceDetailModal.show();
  }
  