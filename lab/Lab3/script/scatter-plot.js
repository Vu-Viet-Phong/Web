var rowConverter = function(d) { 
    return { population: d.population, GRDP: d["GRDP-VND"] }; 
};

d3.csv("../data/vn-provinces-data.csv", rowConverter, function(error, dataset) {
    if (error) {
    console.log(error);
    } else { 
        console.log(dataset);
        
        // Width and height
        var w = 300; 
        var h = 600;
        var padding = 40;

        // Create scale functions
        var xScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, function(d) { return d.population; })])
                       .range([padding, w - padding]);

        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, function(d) { return d["GRDP-VND"]; })])
                       .range([h - padding, padding]);

        var rScale = d3.scaleSqrt()
                       .domain([0, d3.max(dataset, function(d) { return d["GRDP-VND"]; })])
                       .range([0, 10]);

        // Define X axis
        var xAxis = d3.axisBottom()
                      .scale(xScale)
                      .ticks(5);

        // Define Y axis
        var yAxis = d3.axisLeft()
                      .scale(yScale)
                      .ticks(5);

        // Create SVG element
        var svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("fill", "purple");

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
           .attr("cx", function(d) { return xScale(d.population); })
           .attr("cy", function(d) { return yScale(d["GRDP-VND"]); })
           .attr("r", function(d) { return rScale(d.population); });
    }
});
