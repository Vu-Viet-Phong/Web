// Width and height
var w = 500;
var h = 100;

// Data
var dataset = [5, 10, 15, 20, 25];

// Creating svg element
var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("height", h)

var circles = svg.selectAll("circle").data(dataset).enter().append("circle")
  .attr("cx", function(d, i) { return (i * 50) + 25; })
  .attr("cy", h / 2)
  .attr("r", function(d) { return d; })
  .attr("fill", "red")
  .attr("stroke", "black")
  .attr("stroke-width", function(d) { return d / 6; });

