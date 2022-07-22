var dataset = [];

for (var i = 0; i < 25; i++) {
  var new_number = Math.floor(Math.random() * 30);
  dataset.push(new_number);
}

console.log(dataset);

d3.select("body").selectAll("div")
  .data(dataset)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
  });