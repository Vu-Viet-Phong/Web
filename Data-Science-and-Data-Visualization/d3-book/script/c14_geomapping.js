var w = 500, h = 300;

// Define map projection
var projection = d3.geoAlbersUsa()
  .translate([w / 2, h / 2])
  .scale([500]);

// Define path generator
var path = d3.geoPath()
  .projection(projection);

// Define path generator
var color = d3.scaleQuantize()
  .range([
          "rgb(237, 248, 233)", "rgb(186, 228, 179)", 
          "rgb(116, 196, 118)", "rgb(49, 163, 84)", 
          "rgb(0, 109, 44)"
        ]);

// Create geomapping element
var geomapping = d3.select("#geomapping")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Load in argiculture data
d3.csv("../data/us-ag-productivity.csv", function(data, error) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);

    // Set input domain for color scale
    color.domain([
      d3.min(data, function(d) { 
        return d.value;
      }),
      d3.max(data, function(d) {
        return d.value;
      })
    ]);
        
    // Load in GeoJSON data
    d3.json("../json/us-states.json", function(json, error) {
      if (error) {
        console.log(error);
      } else {
        console.log(json);
    
        for (var i = 0; i < data.length; i++) {
          var dataState = data[i].state;
          var dataValue = parseFloat(data[i].value);
          
          for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.name;

            if (dataState == jsonState) {
              json.features[j].properties.value = dataValue;
              break;
            }
          }
        }
      }
    });
  }
});