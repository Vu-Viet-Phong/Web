function generate() {
  var dataset = [];

  for (var i = 0; i < 10; i++) { 
    var newNumber = parseInt(Math.random() * 25); 
    dataset.push(newNumber);
  }

  return dataset;
}

// Chart
function barchart2() {
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
          return i * (w / dataset.length - 20) + 40; 
        })
        .attr("y", function (d) { 
          return h - (d * 4); 
        })
        .attr("width", w / dataset.length - barPadding - 20)
        .attr("height", function (d) { 
          return d * 4 + 60; 
        })
        .attr("fill", function (d) { 
          return "rgb(160, 10, " + (d * 10) + ")"; 
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
          return i * (w / dataset.length - 20) + (w / dataset.length - barPadding) / 2 + 30; 
        })
        .attr("y", function (d) { 
          return h - (d * 4) + 10; 
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
}

barchart2();