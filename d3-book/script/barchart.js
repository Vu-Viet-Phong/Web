// Width and height
var w = 600;
var h = 130;
var barPadding = 1;

// Data
var dataset = [];  						               // Initialize empty array
for (var i = 0; i < 25; i++) {			            // Loop 25 times
	var newNumber = Math.floor(Math.random() * 30); // New random number (0-30)
	dataset.push(newNumber);			               // Add new number to array
}

// Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(d, i) { return i * (w / dataset.length); })
   .attr("y", function(d) { return h - (d * 4); })
   .attr("width", w / dataset.length - barPadding)
   .attr("height", function(d) { return d * 4; })
   .attr("fill", function(d) { return "rgb(0, 0, " + Math.round(d * 10) + ")"; });

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) { return d; })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) { return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; })
   .attr("y", function(d) { return h - (d * 4) + 14; })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");