// Width and height
var w = 500, h = 300;

// Defiene map projection
var projection = d3.geoAlbersUsa()
  .translate([w / 2, h / 2])
  .scale([500]);

// Define path generator, using the Albers USA projection
var path = d3.geoPath()
  .projection(d3.geoAlbersUsa());

// Create SVG element
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Load in GeoJSON data
d3.json("../json/us-states.json", function(json) {
  // Bind data and create one path per GeoJSON feature
  svg.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "steelblue");
});