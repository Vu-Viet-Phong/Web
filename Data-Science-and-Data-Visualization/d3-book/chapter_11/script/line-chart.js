//Width and height
var w = 800;
var h = 300;
var padding = 40;
var dataset, xScale, xAxis, yAxis, yScale, line, dangerLine;

// For converting Dates to strings
var formatTime = d3.timeFormat("%Y");

var rowConverter = function(d) {
  return {
    date: new Date(+d.year, (+d.month - 1)),  
    average: parseFloat(d.average) 
  };
}

d3.csv("data/mauna_loa_co2_monthly_averages.csv", rowConverter, function(data) {
  var dataset = data;

  // Print data to console as table, for verification
  // console.table(dataset, ["date", "average"]);

  // Create scale functions
  xScale = d3.scaleTime()
    .domain([
      d3.min(dataset, function(d) { return d.date; }),
      d3.max(dataset, function(d) { return d.date; })
    ])
    .range([padding, w]);

  yScale = d3.scaleLinear()
    .domain([
      d3.min(dataset, function(d) { if (d.average >= 0) return d.average; }) - 10,
      d3.max(dataset, function(d) { return d.average; })
    ])
    .range([h - padding, 0]);

  xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10)
    .tickFormat(formatTime);

  yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(10);

  // Define line generator
  line = d3.line()
    .defined(function(d) { return d.average >= 0 && d.average <= 350; })
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.average); });

  dangerLine = d3.line()
    .defined(function(d) { return d.average >= 350; })
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.average); });

  // Create SVG element
  var svg = d3.select("#linechart").append("svg").attr("width", w).attr("height", h);
  
  // Create lines
  svg.append("path").datum(dataset).attr("class", "line").attr("d", line);
  svg.append("path").datum(dataset).attr("class", "line danger").attr("d", dangerLine);

  // Create axes
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0, " + (h - padding) + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + padding + ", 0)")
     .call(yAxis);

  // Draw 350 ppm line
  svg.append("line")
     .attr("class", "line safeLevel")
     .attr("x1", padding)
     .attr("x2", w)
     .attr("y1", yScale(350))
     .attr("y2", yScale(350));

  //Label 350 ppm line
  svg.append("text")
     .attr("class", "dangerLabel")
     .attr("x", padding + 20)
     .attr("y", yScale(350) - 7)
     .text("350 ppm “safe” level");
});