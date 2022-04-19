// Encode the attributes
var rowConverter = function (d) {
    return {
        Latitude: parseFloat(d.Latitude),
        Longitude: parseFloat(d.Longitude),
    };
}

d3.csv("../data/GlobalLandTemperaturesByMajorCity.csv", rowConverter, function(error, data) {
    if (error) {
        console.log(error);
    } else { 
        console.log(data);
        draw(data);
    }
});

function draw(data) {
    // Width and height
    var width = 400;
    var height = 300;

    // Margin
    var margin = { top: 10, right: 30, bottom: 30, left: 60, };
    
    // Width and height of scatterplot
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;   
    
    var dataset = data.slice(0, 1000); // 20 items

    // Define scatterplot
	var scatterplot = d3.select("#scatterplot").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define X axis
    var min_long = d3.min(dataset, function (d) { return d.Longitude; });
    var max_long = d3.max(dataset, function (d) { return d.Longitude; });
    var xScale = d3.scaleLinear().domain([min_long, max_long]).range([0, w]).nice();

    // Define Y axis
    var min_lat = d3.min(dataset, function (d) { return d.Latitude; });
    var max_lat = d3.max(dataset, function (d) { return d.Latitude; });
    var yScale = d3.scaleLinear().domain([min_lat, max_lat]).range([h, 0]);
    
    // Create X axis
    scatterplot.append("g").attr("transform", "translate(0," + h + ")").call(d3.axisBottom(xScale));
    
    // Create Y axis
    scatterplot.append("g").call(d3.axisLeft(yScale));

    // Create scatterplot
    scatterplot.append("g").selectAll("dot").data(dataset).enter().append("circle")
               .attr("r", 7)
               .attr("cx", function (d) { return xScale(d.Longitude) })
               .attr("cy", function (d) { return +yScale(d.Latitude) });

    // X label
    scatterplot.append("text").text("Longitude").style("text-anchor", "middle")
               .attr("transform", "translate(" + (w / 2) + " ," + (h + margin.top + 20) + ")")
               .attr("font-family", "Helvetica")
               .attr("font-weight", 500)
               .attr("font-size", "15px");

    // Y label
    scatterplot.append("text").text("Latitude").style("text-anchor", "middle")
               .attr("transform", "rotate(-90)")
               .attr("y", 0 - margin.left)
               .attr("x", 0 - (h / 2))
               .attr("dy", "1em")
               .attr("font-family", "Helvetica")
               .attr("font-weight", 500)
               .attr("font-size", "15px");
}