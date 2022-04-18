var rowConverter = function(d) { 
	return {
		"province": d.province,
		"GRDP-VND": parseFloat(d["GRDP-VND"]),
		ma : +d.ma
	};
}
  
d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", 
	rowConverter, function(error, data) {
	if (error) {
		console.log(error);
	} else { 
		console.log(data);
		draw(data);
	}
});
  
function draw(data) {
	var height = 600;
	var width = 800;

	var margin = { 
		top: 30, 
		right: 30, 
		bottom: 30, 
		left: 150,
	};

	var dataset = data.slice(0, 20); // 20 items

	// Width and height of box
	var w_barchart = width - margin.left - margin.right;
	var h_barchart = height - margin.top - margin.bottom;

	// Create SVG element
	var svg = d3.select("#box")
				//.append("div")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
	
	var barchart = svg.append("g")
	   	.attr("transform", 
	   	     "translate(" + margin.left + ", " + margin.top + ")");

	var xScale = d3.scaleLinear()
				   .domain([0, d3.max(dataset, function (d) { 
					   return d["GRDP-VND"]; 
					})])
				   .range([0, w_barchart])
				   .nice();

	var yScale = d3.scaleBand()
				   .domain(d3.range(dataset.length))
				   .range([h_barchart, 0])
				   .paddingInner(0.05);

	// Define X axis
	var xAxis = d3.axisBottom().scale(xScale);

	// Define Y axis
	var yAxis = d3.axisLeft().scale(yScale);
	
	// Create X axis
	barchart.append("g")
	   .attr("class", "x axis")
	   .attr("transform", "translate(0," + h_barchart + ")")
	   .call(xAxis);

	// Create Y axis
	barchart.append("g")
	   .attr("class", "y axis")
	   .call(yAxis);

	// Create bars
	barchart.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("x", 0)
			.attr("y", function(d, i) { 
				return yScale(i); 
			})
			.attr("width", function(d) { 
				return xScale(d["GRDP-VND"]); 
			})
			.attr("height", yScale.bandwidth())
			.attr("fill", function(d) { 
				return "rgb(0, 0, " + Math.round(d["GRDP-VND"] + 100) + ")"; 
			});

	// Create labels
	barchart.selectAll("text.labels")
			.data(dataset)
			.enter()
			.append("text")
			.attr("class", "labels")
			.text(function (d) { 
				return d["GRDP-VND"]; 
			})
			.attr("text-anchor", "middle")
			.attr("x", function (d) { 
				return xScale(d["GRDP-VND"]) + 20; 
			})
			.attr("y", function (d, i) { 
				return yScale(i) + yScale.bandwidth() / 2 + 4; 
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "14px")
			.attr("fill", "black");

	/* svg.selectAll("text.province")
			.data(dataset)
			.enter()
			.append("text")
			.text(function (d) {
				return d.province;
			})
			.attr("text-anchor", "middle")
			.attr("x", 40)
			.attr("y", function (d, i) {
				return yScale(i) + (yScale.bandwidth() + margin.top) / 2 + 4;
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "black"); */
	
	d3.selectAll("button").on("click", function() {
		var ID = d3.select(this).attr("id");
		
		if(ID == "addBtn") {
			dataset.push(data[dataset.length]);
		} else {
			dataset.pop();
		}

		xScale.domain([0, d3.max(dataset, function(d) { 
				return d["GRDP-VND"]; 
			})])
			.nice();

		yScale.domain(d3.range(dataset.length));

		barchart.select(".xAxis")
			.transition()
			.duration(500)
			.call(xAxis);

			barchart.select(".yAxis")
			.transition()
			.duration(500)
			.call(yAxis);
		
		var key = function(d) {
			return d.province;
		}

		bars = barchart.selectAll("rect")
			           .data(dataset, key);

		bars.enter()
			.append("rect")
			.attr("x", 0)
			.attr("y", h_barchart)
			.attr("width", function(d) {
				return xScale(d["GRDP-VND"]);
			})
			.attr("height", yScale.bandwidth())
			.attr("fill", function(d) {
				return "rgb(0, 0, " + Math.round(d["GRDP-VND"]) + ")";
			})
			.merge(bars) 
			.transition()
			.duration(500)
			.attr("x", 0)
			.attr("y", function(d, i) {
				return yScale(i);
			})
			.attr("width", function(d) {
				return xScale(d["GRDP-VND"]);
			})
			.attr("height", yScale.bandwidth());
		
		bars.exit()
			.transition()
			.duration(500)
			.attr("y", - yScale.bandwidth())
			.remove();

		var addLabel = barchart.selectAll("text")
			                   .data(dataset, key);

		addLabel.enter()
				.append("text")
				.merge(addLabel)
				.transition()
				.duration(500)
				.attr("class", "label")
				.text(function(d) { 
					return d["GRDP-VND"];
				})
				.attr("x", function(d){
					return xScale(d["GRDP-VND"]) + 15;
				})
				.attr("y", function(d, i){
					return yScale(i) + yScale.bandwidth() * (0.7 + 0.1); 
				})
				.attr("font-family" , "sans-serif")
				.attr("font-size" , "14px")
				.attr("fill" , "black")
				.attr("text-anchor", "middle");

			var removeLabel = svg.selectAll(".label")
				.data(dataset, key);

			removeLabel.exit()
				.transition()
				.duration(500)
				.remove();
});

d3.select("#sort-select").on("change", function (event, d) { 
	var criterion = d3.select(this).property("value");

	dataset = dataset.sort(function (a, b) {
		switch (criterion) {
			case "none":
				return b.ma - a.ma;
			case "name":
				if (a.province < b.province)
					return -1;
				else if (a.province > b.province)
					return 1;
				else return 0;
			case "GDP":
				return b["GRDP-VND"] - a["GRDP-VND"];
		}
	});
	
	xScale.domain([0, d3.max(dataset, function(d) { 
			return d["GRDP-VND"]; 
		})])
		.nice();
	
	yScale.domain(d3.range(dataset.length));

	barchart.select(".xAxis")
		.transition()
		.duration(500)
		.call(xAxis);

		barchart.select(".yAxis")
		.transition()
		.duration(500)
		.call(yAxis);

		var key = function(d) {
			return d.province;
		}

	bars = barchart.selectAll("rect")
			       .data(dataset, key);

	bars.enter()
		.append("rect")
		.attr("x", 0)
		.attr("y", h_barchart)
		.attr("width", function(d) {
			return xScale(d["GRDP-VND"]);
		})
		.attr("height", yScale.bandwidth())
		.attr("fill", function(d) {
			return "rgb(0, 0, " + Math.round(xScale(d["GRDP-VND"])) + ")";
		})
		.merge(bars) 
		.transition()
		.duration(500)
		.attr("x", 0)
		.attr("y", function(d, i) {
			return yScale(i);
		})
		.attr("width", function(d) {
			return xScale(d["GRDP-VND"]);
		})
		.attr("height", yScale.bandwidth());

	var addLabel = barchart.selectAll("text")
		.data(dataset, key);

	addLabel.enter()
			.append("text")
			.merge(addLabel)
			.transition()
			.duration(500)
			.attr("class", "label")
			.text(function(d) { 
				return d["GRDP-VND"];
			})
			.attr("x", function(d){
				return xScale(d["GRDP-VND"]) + 20;
			})
			.attr("y", function(d, i){
				return yScale(i) + yScale.bandwidth() * (0.7 + 0.1); 
			})
			.attr("font-family" , "sans-serif")
			.attr("font-size" , "14px")
			.attr("fill" , "black")
			.attr("text-anchor", "middle");
	});
}