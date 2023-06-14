window.onload = function() {
  L.mapquest.key = 'ck2OXUAJsF0iz999XGQ62jyXo8AXOVp7';

  var map = L.mapquest.map('map', {
    center: [39.7392, -104.9903],
    layers: L.mapquest.tileLayer('map'),
    zoom: 4,
    minZoom: 3,
    maxZoom: 8,
    continuousWorld: true
  });

  L.DomUtil.addClass(map._container, 'mapquest-map');

  var maxBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
  map.setMaxBounds(maxBounds);

  window.addEventListener('resize', function() {
    map.invalidateSize();
  });

  /*
  $.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson', function(data) {
    L.geoJSON(data).addTo(map);
  });
  */
};
