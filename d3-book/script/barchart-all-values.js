// Width and height
var w = 600;
var h = 250;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

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
   .attr("x", function(d, i) {
           return xScale(i);
   })
   .attr("y", function(d) {
           return h - yScale(d);
   })
   .attr("width", xScale.bandwidth())
   .attr("height", function(d) {
           return yScale(d);
   })
   .attr("fill", function(d) {
        return "rgb(0, 0, " + Math.round(d * 10) + ")";
   });

// Create labels
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
           return d;
   })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
           return xScale(i) + xScale.bandwidth() / 2;
   })
   .attr("y", function(d) {
           return h - yScale(d) + 14;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");




// On click, update with new data			
d3.select("p").on("click", function() {
        // Add one new value to dataset
        var maxValue = 25;
        var newNumber = Math.floor(Math.random() * maxValue);	// New random integer (0-24)
        dataset.push(newNumber);			 			 		// Add new number to array
        
        // Update scale domains
        xScale.domain(d3.range(dataset.length));	// Recalibrate the x scale domain, given the new length of dataset
        yScale.domain([0, d3.max(dataset)]);		// Recalibrate the y scale domain, given the new max value in dataset

        // Select…
        var bars = svg.selectAll("rect")			// Select all bars
            .data(dataset);							// Re-bind data to existing bars, return the 'update' selection
                                                    // 'bars' is now the update selection
        
        // Enter…
        bars.enter()								// References the enter selection (a subset of the update selection)
            .append("rect")							// Creates a new rect
            .attr("x", w)							// Sets the initial x position of the rect beyond the far right edge of the SVG
            .attr("y", function(d) {				// Sets the y value, based on the updated yScale
                return h - yScale(d);
            })
            .attr("width", xScale.bandwidth())		// Sets the width value, based on the updated xScale
            .attr("height", function(d) {			// Sets the height value, based on the updated yScale
                return yScale(d);
            })
            .attr("fill", function(d) {				// Sets the fill value
                return "rgb(0, 0, " + Math.round(d * 10) + ")";
            })
            .merge(bars)							// Merges the enter selection with the update selection
            .transition()							// Initiate a transition on all elements in the update selection (all rects)
            .duration(500)
            .attr("x", function(d, i) {				// Set new x position, based on the updated xScale
                return xScale(i);
            })
            .attr("y", function(d) {				// Set new y position, based on the updated yScale
                return h - yScale(d);
            })
            .attr("width", xScale.bandwidth())		// Set new width value, based on the updated xScale
            .attr("height", function(d) {			// Set new height value, based on the updated yScale
                return yScale(d);
            });



        // Update all labels
        //
        // Exercise: Modify this code to add a new label each time a new bar is added!
        //
        svg.selectAll("text")
           .data(dataset)
           .transition()
           .duration(500)
           .text(function(d) {
                   return d;
           })
           .attr("x", function(d, i) {
                return xScale(i) + xScale.bandwidth() / 2;
           })
           .attr("y", function(d) {
                return h - yScale(d) + 14;
           });

});