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
    var width = 700;
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
    var min_lat = d3.min(dataset, function (d) { return d.Lat; });
    var max_lat = d3.max(dataset, function (d) { return d.Lat; });
    var xScale = d3.scaleLinear().domain([min_lat, max_lat]).range([0, w]).nice();
    
    // Define Y axis
    var min_long = d3.min(dataset, function (d) { return d.Long; });
    var max_long = d3.max(dataset, function (d) { return d.Long; });
    var yScale = d3.scaleLinear().domain([min_long, max_long]).range([h, 0]).nice();

    // Create X axis
    scatterplot.append("g").attr("transform", "translate(0," + h + ")").call(d3.axisBottom(xScale));
    
    // Create Y axis
    scatterplot.append("g").call(d3.axisLeft(yScale));

    // Create brush
    scatterplot.call(d3.brush().extent([[0, 0], [w, h]]).on("start brush", updateChart));

    // Create scatterplot
    var myCircle = scatterplot.append("g").selectAll("circle").data(dataset).enter().append("circle")
               .attr("r", 5)
               .attr("cx", function (d) { return xScale(d.Lat) })
               .attr("cy", function (d) { return yScale(d.Long) })
               .attr("fill", "steelblue")
               .style("opacity", "0.7")
               .on("mouseover",handleMouseOver)
               .on("mouseout", handleMouseOut);

    // Define the tooltip
    var tooltip = d3.select("#scatterplot").append("div").attr("class", "tooltip");

    function handleMouseOver(d, i) {
        tooltip.transition().duration(100).style("text-anchor", "end").style("opacity", 100);
        tooltip.html("Country: " + d["Country/Region"] + "<br/>Province/State: " + d["Province/State"] + "<br/> (" + d.Long + ", " + d.Lat + ")" + "<br/> Confirmed cases: " + d.date + ")")
               .style("left", d3.event.pageX + 5 + "px")
               .style("top", d3.event.pageY - 30 + "px");
    }

    function handleMouseOut(d, i) {
        tooltip.transition().duration(200).style("opacity", 0);
    }

    function updateChart() {        
        myCircle.classed("selected", function(d) { 
            return isBrushed(d3.event.selection, xScale(d.Lat), yScale(d.Long)); 
        })
    }

    function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0], x1 = brush_coords[1][0],
            y0 = brush_coords[0][1], y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }
}