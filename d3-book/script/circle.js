// Data
var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
               11, 12, 15, 20, 18, 17, 16, 18, 23, 18];

// Width and height
var w = 1100;
var h = 100;

// Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var circles = svg.selectAll("circle")
	    		 .data(dataset)
				 .enter()
			     .append("circle");

circles.attr("cx", function(d, i) { return (i * 50) + 25; })
	   .attr("cy", h/2)
	   .attr("r", function(d) { return d; })
       .attr("fill", "red")
	   .attr("stroke", "black")
	   .attr("stroke-width", function(d) { return d/4; });