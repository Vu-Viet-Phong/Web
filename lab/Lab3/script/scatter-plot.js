var rowConverter = function(d) { 
  return {
    population: parseFloat(d.population),
    "GRDP-VND": parseFloat(d["GRDP-VND"]),
    area: parseFloat(d.area),
    density: parseFloat(d.density)
  };
}

d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", rowConverter, function(error, data) {
  if (error) {
    console.log(error);
  } else { 
    console.log(data);
    scatter_plot(data);
  }
});

function scatter_plot(dataset) {
  // Width and height
  var h = 300; 
  var w = 600;
  var padding = 50;

  // Create scale functions
  var xScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { 
                  return d.population; 
                })])
                .range([padding, w - padding])
                .nice();

  var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { 
                  return d["GRDP-VND"]; 
                })])
                .range([h - padding, padding])
                .nice();

  var rScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { 
                  return d.area; 
                })])
                .range([0, 10]);

  var colorScale = d3.scaleOrdinal()
                    .domain([0, d3.max(dataset, function(d) { 
                      return d.density; 
                    })])
                    .range(d3.schemeSet1);

  // Define X axis
  var xAxis = d3.axisBottom()
                .scale(xScale);

  // Define Y axis
  var yAxis = d3.axisLeft()
                .scale(yScale);

  // Create SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  // Create X axis
  svg.append("g")
    .attr("class", "axis") 
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  // Create Y axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  // Create circles
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) { 
      return xScale(d.population); 
    })
    .attr("cy", function(d) { 
      return yScale(d["GRDP-VND"]); 
    })
    .attr("r", function(d) { 
      return rScale(d.area); 
    })
    .attr("fill", function(d) { 
      return colorScale(d.density); 
    });

  svg.append("text")
    .text("Population")
    .attr("transform", "translate(" + w / 2 + " ," + (h - 5) + ")")
    .attr("font-family", "Helvetica")
    .attr("font-weight", 500)
    .attr("font-size", "15px")
    .style("text-anchor", "middle");

  svg.append("text")
    .text("GRDP-VND")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - h / 2)
    .attr("dy", "1em")
    .attr("font-family", "Helvetica")
    .attr("font-weight", 500)
    .attr("font-size", "15px")
    .style("text-anchor", "middle");
}