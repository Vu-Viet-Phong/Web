// Create SVG generator
var path = d3.geoPath()
  .projection();

var rowConverter = function(d) {
  return {
    ma: parseFloat(d.ma),
    area: parseFloat(d.area / 1000),
  };
}

d3.csv("../data/vn-provinces-data.csv", rowConverter, function(error, data) {
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

    d3.json("../json/vn-provinces.json", function(error, json) {
      if (error) {
        console.log(error) 
      } else {
        console.log(json);
        
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

        geomapping
      }
    })
  }
});