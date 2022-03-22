function generate(numValues, max_value) {
    var data = []; // Initialize empty array
    
    for (var i = 0; i < numValues; i++) {                       // Loop numValues times
        var newNumber = Math.floor(Math.random() * max_value);  // New random integer (0-max_value)
        data.push(newNumber);                                   // Add new number to array
    }

    return data;
}

// Width and height
var w = 800;
var h = 300;

var maxValue = 30; // Highest possible new value
var dataset = generate(30, maxValue);

var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length))
               .rangeRound([0, w])
               .paddingInner(0.05);

var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)])
               .range([0, h]);

// Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Create bars
svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(d, i) { return xScale(i); })
   .attr("y", function(d) { return h - yScale(d); })
   .attr("width", xScale.bandwidth())
   .attr("height", function(d) { return yScale(d); })
   .attr("fill", function(d) { return "rgb(0, 0, " + Math.round(d * 10) + ")"; });

// Create labels
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) { return d; })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; })
   .attr("y", function(d) { return h - yScale(d) + 14; })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");

// On click, update with new data			
d3.select("h3").on("click", function() {
    // New values for dataset
    var numValues = dataset.length; // Count original length of dataset
    var newMaxValue = 100;	            // Highest possible new value
    dataset = generate(numValues, newMaxValue);

    // Update scale domain
	// Recalibrate the scale domain, given the new max value in dataset
    yScale.domain([0, d3.max(dataset)]);

    // Update all rects
    svg.selectAll("rect")
       .data(dataset)
       .transition() // <-- This makes it a smooth transition!
    // .delay(500)   // <-- A static, 1s delay before transition begins
       .delay(function(d, i) { return i * 200; }) // One-tenth of an additional second delay for each subsequent element 
       .duration(500)          // <-- Controlled duration, 2000 = 2s
    // .ease(d3.easeCircleIn)   // easeLinear/easeCircleIn/easeElasticOut/easeBounceOut
       .attr("y", function(d) { return h - yScale(d); })
       .attr("height", function(d) { return yScale(d); })
       .attr("fill", function(d) { return "rgb(0, 0, " + Math.round(d * 10) + ")"; });
    
    // Update all labels
    svg.selectAll("text")
       .data(dataset)
       .transition()
       .duration(500)
    // .delay(500)
       .delay(function(d, i) { return i * 200; }) // One-tenth of an additional second delay for each subsequent element 	
    // .ease(d3.easeCircleIn)
       .text(function(d) { return d; })
       .attr("x", function(d, i) { return xScale(i) + xScale.bandwidth() / 2; })
       .attr("y", function(d) { return h - yScale(d) + 14; });
});