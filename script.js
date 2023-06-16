am4core.ready(function() {
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create map instance
  var chart = am4core.create("chartdiv", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_worldLow;

  // Set projection
  chart.projection = new am4maps.projections.NaturalEarth1();

  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
  polygonSeries.mapPolygons.template.strokeWidth = 0.5;

  // Exclude Antarctica
  polygonSeries.exclude = ["AQ"];

  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure series
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.fill = chart.colors.getIndex(0);

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = chart.colors.getIndex(2);

  // Set up the country-specific language color
  var languageColor = chart.colors.getIndex(3);

  // Add an additional state to preserve language color when not hovered
  var fixedState = polygonTemplate.states.create("fixed");
  fixedState.properties.fill = languageColor;

  // Language data
  var languageData;

  // Fetch language data from JSON file
  function fetchLanguageData() {
    fetch("languages_codes.json")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        languageData = data;
      })
      .catch(function(error) {
        console.log("Error fetching language data:", error);
      });
  }

  // Change country colors based on selected language
  function changeLanguageColor(language) {
    // Reset colors for all countries
    polygonSeries.mapPolygons.each(function(polygon) {
      polygon.fill = chart.colors.getIndex(0);
    });

    // Find the corresponding countries for the selected language
    var countries = languageData.countries.find(function(item) {
      return item.language === language;
    });

    if (countries) {
      // Change the color of the countries for the selected language
      polygonSeries.mapPolygons.each(function(polygon) {
        if (countries.countries.includes(polygon.dataItem.dataContext.id)) {
          polygon.fill = languageColor;
        }
      });
    }
  }

  // Initialize the map and language data
  function initialize() {
    fetchLanguageData();
  }

  // Event listeners for language buttons
  document.getElementById("es").addEventListener("click", function() {
    changeLanguageColor("es");
  });

  document.getElementById("en").addEventListener("click", function() {
    changeLanguageColor("en");
  });

  document.getElementById("fr").addEventListener("click", function() {
    changeLanguageColor("fr");
  });

  document.getElementById("ru").addEventListener("click", function() {
    changeLanguageColor("ru");
  });

  document.getElementById("zh").addEventListener("click", function() {
    changeLanguageColor("zh");
  });

  document.getElementById("ar").addEventListener("click", function() {
    changeLanguageColor("ar");
  });

  // Call the initialize function to start the map and fetch language data
  initialize();
});
