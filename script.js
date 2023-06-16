am4core.ready(function () {
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
  polygonTemplate.fill = am4core.color("#9e9e9e");


  // Create hover state and set alternative stroke color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.stroke = am4core.color("#FFFFFF");
  hs.properties.strokeWidth = 5;


  // Set default zoom level
  chart.homeZoomLevel = 0; // Adjust the value as per your preference

  // Language button click handler
  var langButtons = document.getElementsByClassName("lang-button");
  var activeLanguages = [];

  var languageColors = {
    es: "#FF69B4", // Spanish: Pink
    en: "#0000FF", // English: Blue
    fr: "#800080", // French: Purple
    ar: "#008000", // Arabic: Green
    ru: "#FF0000", // Russian: Red
    zh: "#FFFF00", // Chinese: Yellow
  };


  function updateMapColors() {
    // Reset colors
    polygonSeries.mapPolygons.each(function (polygon) {
      polygon.fill = am4core.color("#9e9e9e");
    });

    // Apply active languages' colors
    activeLanguages.forEach(function (lang, index) {
      var countries = languageData.countries.find(function (data) {
        return data.language === lang;
      });

      if (countries) {
        var color = languageColors[lang];

        countries.countries.forEach(function (countryCode) {
          var polygon = polygonSeries.getPolygonById(countryCode);
          if (polygon) {
            polygon.fill = am4core.color(color);
          }
        });
      }
    });
  }

  Array.prototype.forEach.call(langButtons, function (button) {
    button.addEventListener("click", function () {
      var lang = this.getAttribute("data-lang");
      var langIndex = activeLanguages.indexOf(lang);

      if (langIndex === -1) {
        // Language not active, add to active languages
        activeLanguages.push(lang);
      } else {
        // Language active, remove from active languages
        activeLanguages.splice(langIndex, 1);
      }

      updateMapColors();
    });
  });

  var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());

  // Load language data from JSON file
  fetch("languages_codes.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      languageData = data;
    })
    .catch(function (error) {
      console.log("Error loading language data:", error);
    });
});
