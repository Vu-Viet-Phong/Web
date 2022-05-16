var rowConverter = function (d) {
  return {
      ["Country"]: d["Country"],
      "Date": d3.timeParse("%m/%d/%Y")(d.Date),
      Number_of_confirmed_cases: parseInt(d.Number_of_confirmed_cases)
  }
}

d3.csv("https://raw.githubusercontent.com/MrCat-2510/Testing/main/time_series_covid19_confirmed_VN__US_Frn_Italy.csv",rowConverter, function (error, data) {
  if (error) { 
    console.log(error);
  } else {
    console.log(data);
    draw(data);
  }
});

function draw(data) {
  var margin = { top: 10, right: 30, bottom: 30, left: 60, };
  var width = 800 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  // For converting Dates to strings
	var formatTime = d3.timeFormat("%Y");
    
  var sum = d3.nest().key(function (d) { return d["Country"]; }).entries(data);
  console.log(sum);

  // Create scale functions
  var xScale = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.Date; }))
      .range([0, width - 200]);

  var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d.Number_of_confirmed_cases; })])
      .range([height, 0]);

  var res = sum.map(function (d) { return d.key });

  var colorScale = d3.scaleOrdinal()
    .domain(res)
    .range(['#EE811D', '#377eb8', '#4daf4a', "#984ea3"]);

  // Define axes
  var xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);
  var yAxis = d3.axisLeft().scale(yScale).ticks(10);

  // Create linechart element
  var linechart = d3.select("#linechart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create axes
  linechart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  linechart.append("g")
    .attr("class", "axis")
    .call(yAxis);
  
  // Create line
  linechart.selectAll(".line")
    .data(sum)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("class", function (d) { return ("lines " + d.key); })
    .attr("stroke", function (d) { return colorScale(d.key); })
    .attr("stroke-width", 3)
    .attr("d", function (d) { return d3.line()
      .x(function (d) { return xScale(d.Date); })
      .y(function (d) { return yScale(+d.Number_of_confirmed_cases); }) (d.values)
    });
}