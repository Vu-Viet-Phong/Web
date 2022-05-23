var rowConverter = function(d) {
  return {
    ma: parseFloat(d.ma),
    area: parseFloat(d.area / 1000),
  };
}

d3.csv("https://raw.githubusercontent.com/vtenpo/Web/main/Data-Science-and-Data-Visualization/labs/Lab7/data/vn-provinces-data.csv", 
  rowConverter, function(data, error) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      geomapping(data);
    }
});

function geomapping(data) {
  var dataset = data;
  
}