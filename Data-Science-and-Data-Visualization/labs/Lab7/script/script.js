var w = 800, h = 480;

// Create path generator
var path = d3.geoPath()
  .projection();

//Define quantize scale to sort data values into buckets of color
var color = d3.scaleQuantize()
  .range([
          "rgb(255, 210, 255)", "rgb(210, 190, 220)", 
          "rgb(160, 120, 170)", "rgb(140, 90, 150)", 
          "rgb(120, 70, 140)"
        ]);

// Create geomapping element
var geomapping = d3.select("#geomapping")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var rowConverter = function(d) {
  return {
    ma: parseFloat(d.ma),
    area: parseFloat(d.area / 1000),
  };
}

d3.csv("https://raw.githubusercontent.com/vtenpo/Web/main/Data-Science-and-Data-Visualization/labs/Lab7/data/vn-provinces-data.csv", rowConverter, function(error, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);

    // Set input domain for color scale
    color.domain([
      d3.min(data, function(d) {
        return d.are;
      }),
      d3.max(data, function(d) {
        return d.area;
      })
    ]);

    d3.json("https://raw.githubusercontent.com/vtenpo/Web/main/Data-Science-and-Data-Visualization/labs/Lab7/json/vn-provinces.json", function(json) {
        // Merge the ag. data and GeoJSON
        for (var i = 0; i < data.length; i++) {
          var dataProvince = data[i].ma;
          var dataArea = data[i].area;

          // Find the corresponding province code inside the GeoJSON
          for (var j = 0; j < json.features.length; j++) {
            var jsonProvince = json.features[j].properties.ma;

            if (dataProvince == jsonProvince) {
              // Copy the data value into the JSON
              json.features[j].properties.ma = dataArea;
              break;
            }
          } 
        }
    });
  }

  
});