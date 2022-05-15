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
  var sum, xScale, yScale, xAxis, yAxis, res, colorScale;
  var linechart, tooltip, lines, mousePerLine;

  // For converting Dates to strings
	var formatTime = d3.timeFormat("%Y");
    
  sum = d3.nest().key(function (d) { return d["Country"]; }).entries(data);
  console.log(sum);

  // Create scale functions
  xScale = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.Date; }))
      .range([0, width - 200]);

  yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d.Number_of_confirmed_cases; })])
      .range([height, 0]);

  res = sum.map(function (d) { return d.key });

  colorScale = d3.scaleOrdinal()
    .domain(res)
    .range(['#EE811D', '#377eb8', '#4daf4a', "#984ea3"]);

  // Define axes
  xAxis = d3.axisBottom().scale(xScale).ticks(10).tickFormat(formatTime);
  yAxis = d3.axisLeft().scale(yScale).ticks(10);

  // Create linechart element
  linechart = d3.select("#linechart")
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

  
  // Hover tooltip with vertical line
  tooltip = d3.select("#linechart")
    .append("div")
    .attr('id', 'tooltip')
    .style("position", "absolute")
    .style("opacity", 0)
    .style('display', 'none');

  var mouseG = linechart.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "#A9A9A9")
      .style("stroke-width", "2px")
      .style("opacity", "0");

  lines = document.getElementsByClassName('line');

  mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(sum)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 4)
    .style("stroke", function (d) { return colorScale(d.key); })
    .style("fill", "none")
    .style("stroke-width", "2px")
    .style("opacity", "0");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width - 200)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function () { // on mouse out hide line, circles and text
      d3.select(".mouse-line").style("opacity", "0");
      d3.selectAll(".mouse-per-line circle").style("opacity", "0");
      d3.selectAll(".mouse-per-line text").style("opacity", "0");
      d3.selectAll("#tooltip").style('display', 'none');
    })
    .on('mouseover', function () { // on mouse in show line, circles and text
      d3.select(".mouse-line").style("opacity", "1");
      d3.selectAll(".mouse-per-line circle").style("opacity", "1");
      d3.selectAll("#tooltip").style("opacity", "1").style('display', 'block');
    })
    .on('mousemove', function () { 
      var mouse = d3.mouse(this);
      d3.selectAll(".mouse-per-line")
        .attr("transform", function (d, i) {
          var xDate = xScale.invert(mouse[0])
          var bisect = d3.bisector(function (d) { return d.Date; }).left 
          var idx = bisect(d.values, xDate);
          d3.select(".mouse-line")
            .attr("d", function () {
              var data = "M" + xScale(d.values[idx].Date) + "," + (height);
              data += " " + xScale(d.values[idx].Date) + "," + 0;
              return data;              
            });
            return "translate(" + xScale(d.values[idx].Date) 
              + "," + yScale(d.values[idx].Number_of_confirmed_cases) + ")";
        });
      updateTooltipContent(mouse, sum);
    });

  function updateTooltipContent(mouse, sum) {
    sorting = []
    sum.map(d => {
      var xDate = xScale.invert(mouse[0]);
      var bisect = d3.bisector(function (d) { return d.Date; }).left;
      var idx = bisect(d.values, xDate);
      
      sorting.push({
        Country: d.values[idx]["Country"],
        Number_of_confirmed_cases: d.values[idx].Number_of_confirmed_cases,
      });
    });

    sorting.sort(function (x, y) {
      return d3.descending(x.Number_of_confirmed_cases, y.Number_of_confirmed_cases);
    });

    var sortArr = sorting.map(d => d["Country"])
    var res_nested1 = sum.slice().sort(function (a, b) {
      var a = sortArr.indexOf(a.Number_of_confirmed_cases);
      var b = sortArr.indexOf(b.Number_of_confirmed_cases);
      return a - b;
    });

    tooltip.html("Save " + sorting[0]["Country"] 
    + " Jesus!!!. Highest case = " + sorting[0].Number_of_confirmed_cases)
      .style('display', 'block')
      .style('left', d3.event.pageX + 20 + "px")
      .style('top', d3.event.pageY - 20 + "px")
      .style('font-size', '14px')
      .selectAll()
      .data(res_nested1)
      .enter() // for each vehicle category, list out name and price of premium
      .append('div')
      .style('color', d => { return colorScale(d.key); })
      .style('font-size', '12')
      .html(d => {
        var xDate = xScale.invert(mouse[0])
        var bisect = d3.bisector(function (d) { return d.Date; }).left
        var idx = bisect(d.values, xDate)
        return d.key + ": " + d.values[idx].Number_of_confirmed_cases.toString();
      });
  }

  var highlight = function (d) {
    d3.selectAll(".lines").style("opacity", 0.05);
    d3.selectAll("." + d).style("opacity", 1);
  };

  var opacity = function (d) { d3.selectAll(".lines").style("opacity", 1) };

  var size = 35;

  var groups = ["Vietnam", "US", "France", "Italy"];

  linechart.selectAll("myrect")
    .data(groups)
    .enter()
    .append("circle")
    .attr("cx", 600)
    .attr("cy", function (d, i) { return 10 + i * (size + 5); })
    .attr("r", 10)
    .style("fill", function (d) {return colorScale(d); })
    .on("mouseover", highlight)
    .on("mouseleave", opacity);

  linechart.selectAll("mylabels")
    .data(groups)
    .enter()
    .append("text")
    .attr("x", 600 + size * .8)
    .attr("y", function (d, i) { return i * (size + 5) + (size / 2) - 9; })
    .style("fill", function (d) { return colorScale(d);})
    .text(function (d) { return d; })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", opacity);
}