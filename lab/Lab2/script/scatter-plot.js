function scatter_plot() {
  var rowConverter = function(d) { 
    return { Midterm: d.Midterm, Final: d.Final }; 
  };

  d3.csv("https://tungth.github.io/data/vis-lab2-data.csv", rowConverter, function(error, dataset) {
    if (error) {
      console.log(error);
    } else { 
      console.log(dataset); // Log the data
      draw(dataset);
    }
  });
}

function draw(dataset) {
  // Width and height
  var w = 400; 
  var h = 400;
  var padding = 30;

  // Create scale functions
  var xScale = d3.scaleLinear()
                .domain([0, 100])
                .range([padding, w]);

  var yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([h, padding]);

  // Define X axis
  var xAxis = d3.axisBottom()
                .scale(xScale);
  
  // Define Y axis
  var yAxis = d3.axisLeft()
                .scale(yScale);            

  // Create SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w + padding)
              .attr("height", h + padding);

  // Create X axis
  svg.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

  // Create Y axis
  svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  // Create circles
  svg.append("g")
    .selectAll("dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) { 
      return xScale(d.Midterm); 
    })
    .attr("cy", function(d) { 
      return yScale(d.Final); 
    })
    .attr("r", 5)
    .style("fill", function(d) {
        var final_score = (d.Midterm * 60 + d.Final * 40) / 100;

        if (final_score > 50) {
          return "#3f0ce8";
        }

        return "#d90d3d";
    }); 
}

scatter_plot();