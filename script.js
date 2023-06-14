// Load the GeoJSON file
fetch('countries.geojson')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Call the initMap function and pass the country boundaries data
    initMap(data);
  })
  .catch(function(error) {
    console.log('Error:', error);
  });

  function initMap(countriesData) {
    var passportSelect = document.getElementById('passport');
    var selectedPassport = passportSelect.value;

    var southWest = L.latLng(-90, -180); // Southwest coordinates of the map boundary
    var northEast = L.latLng(90, 180);   // Northeast coordinates of the map boundary
    var bounds = L.latLngBounds(southWest, northEast);
    
    var map = L.map('map', {
      maxBounds: bounds,  // Set the maximum boundaries
      maxBoundsViscosity: 1.0, // Adjust the restriction behavior
      minZoom: 2.6, // Set the minimum zoom level
      zoomSnap: 0.5 // Adjust the zoom levels to snap at half-intervals
    }).setView([0, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
  
    var countries = [
      { name: 'United States', code: 'US', color: '#00FF00' },
      { name: 'United Kingdom', code: 'UK', color: '#FF0000' },
      { name: 'Germany', code: 'DE', color: '#0000FF' },
      // Add more countries with their respective entry requirements
    ];
  
    var geojsonLayer;
  
    function styleFeature(feature) {
      var countryColor = '#CCCCCC';
      countries.forEach(function(country) {
        if (country.code === selectedPassport) {
          if (feature.properties.name === country.name) {
            countryColor = country.color;
          }
        }
      });
  
      return {
        fillColor: countryColor,
        weight: 1,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.6
      };
    }
  
    function highlightFeature(e) {
      var layer = e.target;
  
      layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });
  
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
    }
  
    function resetHighlight(e) {
      geojsonLayer.resetStyle(e.target);
    }
  
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }
  
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }
  
    function updateMap() {
      if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
      }
  
      selectedPassport = passportSelect.value;
  
      geojsonLayer = L.geoJSON(countriesData, {
        style: styleFeature,
        onEachFeature: onEachFeature
      }).addTo(map);
    }
  
    passportSelect.addEventListener('change', updateMap);
  
    updateMap();
  }
  