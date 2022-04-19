function generate() {
  var dataset = []; // Initialize empty array

  for (var i = 0; i < 20; i++) {                  // Loop 20 times
    var newNumber = parseInt(Math.random() * 25); // New random number (0-24)
    dataset.push(newNumber);                      // Add new number to array
  }

  return dataset;
}

// Chart
function barchart() {
  var w = 500;
  var h = 150;
  var barPadding = 1;
  var padding = 30;
  var dataset = generate();

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w + padding)
              .attr("height", h + padding);

      svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")  
        .attr("x", function (d, i) { 
          return i * (w / dataset.length); 
        })
        .attr("y", function (d) { 
          return h - (d * 4); 
        })
        .attr("width", w / dataset.length - barPadding)
        .attr("height", function (d) { 
          return d * 4; 
        })
        .attr("fill", function (d) { 
          return "rgb(0, 0, " + Math.round(d * 10) + ")"; 
        });    

      svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) { 
          return d; 
        })
        .attr("text-anchor", "middle")
        .attr("x", function (d, i) { 
          return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; 
        })
        .attr("y", function (d) { 
          return h - (d * 4) + 10; 
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white"); 
}

barchart();