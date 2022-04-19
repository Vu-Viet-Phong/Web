// Encode the attributes
var rowConverter = function (d) {
    return {
        ["Province/State"]: d["Province/State"],
        ["Country/Region"]: d["Country/Region"],
        Lat: parseFloat(d.Lat),
        Long: parseFloat(d.Long),
        date: parseInt(d["5/4/20"])
    };
}

d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv", rowConverter, function(error, data) {
    if (error) {
        console.log(error);
    } else { 
        console.log(data);
        draw(data);
    }
});

function draw(dataset) {
    // Width and height
    var width = 800;
    var height = 600;

    // Margin
    var margin = { top: 10, right: 30, bottom: 30, left: 60, };
    
    // Width and height of scatterplot
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;   

    // Define scatterplot
	var scatterplot = d3.select("#scatterplot").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define X axis
    var min_long = d3.min(dataset, function (d) { return d.Long; });
    var max_long = d3.max(dataset, function (d) { return d.Long; });
    var xScale = d3.scaleLinear().domain([min_long, max_long]).range([0, w]);

    // Define Y axis
    var min_lat = d3.min(dataset, function (d) { return d.Lat; });
    var max_lat = d3.max(dataset, function (d) { return d.Lat; });
    var yScale = d3.scaleLinear().domain([min_lat, max_lat]).range([h, 0]);
    
    // Create X axis
    scatterplot.append("g").attr("transform", "translate(0," + h + ")").call(d3.axisBottom(xScale));
    
    // Create Y axis
    scatterplot.append("g").call(d3.axisLeft(yScale));

    // Color opacity for the dots
        var cValue = function (d) { return d.date; }
        var color = d3.scaleOrdinal().domain(["versicolor"]).range(["#21908dff"])

    // Define the tooltip
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");

    // Create scatterplot
    scatterplot.append("g").selectAll("dot").data(dataset).enter().append("circle")
               .attr("r", 7)
               .attr("cx", function (d) { return xScale(d.Long) })
               .attr("cy", function (d) { return yScale(d.Lat) })
               .style("fill", function (d) { return color(cValue(d)); })
               .style("opacity", 0.6)
               .on("mouseover", function (d) { 
                    tooltip.transition().duration(100).style("text-anchor", "end").style("opacity", 100);
                    tooltip.html("Country: " + d["Country/Region"] + "<br/> (" + d.Long + ", " + d.Lat + ")" + "<br/> Confirmed cases: " + d.date +")")
                           .style("left", d3.event.pageX + 5 + "px")
                           .style("top", d3.event.pageY - 30 + "px"); 
               })
               .on("mouseout", function (d) { tooltip.transition().duration(200).style("opacity", 0); });

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