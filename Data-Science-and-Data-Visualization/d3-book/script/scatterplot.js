var w = 500, h = 300, padding = 40;

// Dynamic, random dataset
var dataset = [];
var numDataPoints = 50;
var maxRange = Math.random() * 1000;

for (var i = 0; i < numDataPoints; i++) {
  var newNumber1 = Math.floor(Math.random() * maxRange);
  var newNumber2 = Math.floor(Math.random() * maxRange);
  dataset.push([newNumber1, newNumber2]);
}

// Create xscale functions
var xScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) {
    return d[0]; 
  })])
  .range([padding, w - padding]);

// Create yscale functions
var yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) {
    return d[1];
  })])
  .range([h - padding, padding]);

// Define X axis
var xAxis = d3.axisBottom()
  .scale(xScale)
  .ticks(5);

// Define Y axis
var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(5);

// Create scatterplot element
var scatterplot = d3.select("#scatterplot")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Define clipping path
scatterplot.append("clipPath")
  .attr("id", "chart-area")
  .append("rect")
  .attr("x", padding)
  .attr("y", padding)
  .attr("width", w - padding * 3)
  .attr("height", h - padding * 2); 

// Create circles
scatterplot.append("g")
  .attr("id", "circle")
  .attr("clip-path", "url(#chart-area)")
  .selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return xScale(d[0]);
  })
  .attr("cy", function(d) {
    return yScale(d[1]);
  })
  .attr("r", 2);

// Create X axis
scatterplot.append("g")
  .attr("class", "x_axis")
  .attr("transform", "translate(0, " + (h - padding) + ")")
  .call(xAxis);

// Create Y axis
scatterplot.append("g")
  .attr("class", "y_axis")
  .attr("transform", "translate(" + padding + ", 0)")
  .call(yAxis);

// On click, update with new data
d3.select("p")
  .on("click", function() {
    // New values for dataset
    var numValues = dataset.length;
    var maxRange = Math.random() * 1000;
    
    dataset = [];
    for (var idx = 0; idx < numValues; idx++) {
      var newNumber1 = Math.floor(Math.random() * maxRange);
      var newNumber2 = Math.floor(Math.random() * maxRange);
      dataset.push([newNumber1, newNumber2]);
    }

    // Update xscale
    xScale.domain([0, d3.max(dataset, function(d) { 
      return d[0]; 
    })]);

    // Update yscale
    yScale.domain([0, d3.max(dataset, function(d) { 
      return d[1]; 
    })]);

    // Update all circles
    scatterplot.selectAll("circle")
      .data(dataset)
      .transition()
      .duration(1000)
      .on("start", function() {
        d3.select(this)
          .attr("fill", "magenta")
          .attr("r", 3)
      })
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      /*    
      .on("end", function() {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("fill", "black")
          .attr("r", 2);
      }); 
      */
      .transition()
      .duration(1000)
      .attr("fill", "black")
      .attr("r", 2);
      
    // Update X axis
    scatterplot.select(".x_axis")
      .transition()
      .duration(1000)
      .call(xAxis);

    // Update Y axis
    scatterplot.select(".y_axis")
      .transition()
      .duration(1000)
      .call(yAxis); 
  });