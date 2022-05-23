var w = 800, h = 480;

// Define map projection
var projection = d3.geoAlbersUsa()
  .translate([w / 2, h / 2])
  .scale([1000]);         

// Define path generator
var path = d3.geoPath()
  .projection(projection);

// Create SVG element
var geomapping = d3.select("#geomapping")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Define quantize scale to sort data values into buckets of color
var color = d3.scaleQuantize()
  .range([
          "rgb(237, 248, 233)", "rgb(186, 228, 179)",
          "rgb(116, 196, 118)", "rgb(49, 163, 84)", 
          "rgb(0, 109, 44)"
        ]);
  
// Number formatting for population values
var formatAsThousands = d3.format(","); // eg. converts 123455 to "123,456"

// Load in agriculture data
d3.csv("../data/us-ag-productivity.csv", function(error, data) {
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

    // Load GeoJSON data
    d3.json("../json/us-states.json", function(error, json) {
      if (error) {
        console.log(error);
      } else {
        console.log(json);

        // Merge the ag. data and GeoJSON
        for (var i = 0; i < data.length; i++) {
          var dataState = data[i].state;
          var dataValue = parseFloat(data[i].value);
          
          // Find the corresponding state inside the GeoJSON
          for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.name;
      
            if (dataState == jsonState) {
              // Copy the data value into the JSON
              json.features[j].properties.value = dataValue;
              break;
            }
          }		
        }

        // Bind data and create one path per GeoJSON feature
        geomapping.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", function(d) {
            var value = d.properties.value;

            if (value) {
              return color(value);
            } else {
              return "#ccc";
            }
          });

        // Load in cities data
        d3.csv("../data/us-cities.csv", function(error, data) {
          geomapping.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
              return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
              return projection([d.lon, d.lat])[1];
            })
            .attr("r", function(d) {
              return Math.sqrt(parseInt(d.population) * 0.00004);
            })
            .style("fill", "red")
            .style("stoke", "gray")
            .style("stoke-width", 0.25)
            .style("opacity", 0.75)
            .append("title")  // simple tooltip
            .text(function(d) {
              return d.place + ": Pop. " +  (d.population);
            });           
        });
      }
    });
  }
});