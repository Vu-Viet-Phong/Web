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

// Load in GeoJSON data
d3.json("../json/us-states.json", function(json, error) {
  if (error) {
    console.log(error);
  } else {
    console.log(json);

    geomapping.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "steelblue");
  }
});