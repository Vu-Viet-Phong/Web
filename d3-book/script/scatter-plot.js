// Width and height
var w = 500;
var h = 400;
var padding = 40;

/*
// Static dataset 
var dataset = [ 
                  [5, 20], [480, 90], [250, 50], [100, 33], [330, 95], 
                  [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], 
                  [600, 150] 
              ];
*/ 

// Dynamic, random dataset
var dataset = [];					      // Initialize empty array
var numDataPoints = 50;				   // Number of dummy data points to create
var xRange = Math.random() * 1000;	// Max range of new x values
var yRange = Math.random() * 1000;	// Max range of new y values

for (var i = 0; i < numDataPoints; i++) {					   // Loop numDataPoints times
   var newNumber1 = Math.floor(Math.random() * xRange);	// New random integer
   var newNumber2 = Math.floor(Math.random() * yRange);	// New random integer
   dataset.push([newNumber1, newNumber2]);					// Add new number to array
}

// Create scale functions
var xScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, function(d) { return d[0]; })])
               .range([padding, w - padding]);

var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, function(d) { return d[1]; })])
               .range([h - padding, padding]);

var rScale = d3.scaleSqrt()
               .domain([0, d3.max(dataset, function(d) { return d[1]; })])
               .range([0, 10]);

// var formatAsPercentage = d3.format(".1%");

// Define X axis
var xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(5); // Set rough # of ticks
           // .tickValues([0, 100, 250, 600]);
           // .tickFormat(formatAsPercentage);
// Define X axis
var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(5); // Set rough # of ticks
           // .tickFormat(formatAsPercentage);

// Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("fill", "purple");

// Create circles
svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("cx", function(d) { return xScale(d[0]); })
   .attr("cy", function(d) { return yScale(d[1]); })
   .attr("r", function(d) { return rScale(d[1]); });

// Create labels   
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) { return d[0] + "," + d[1]; })
   .attr("x", function (d) { return xScale(d[0]); })
   .attr("y", function(d) { return yScale(d[1]); })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "black");

// Create X axis
svg.append("g")
   .attr("class", "axis") // Assign "axis" class
   .attr("transform", "translate(0," + (h - padding) + ")")
   .call(xAxis);

// Create Y axis
svg.append("g")
   .attr("class", "axis") // Assign "axis" class
   .attr("transform", "translate(" + padding + ",0)")
   .call(yAxis);