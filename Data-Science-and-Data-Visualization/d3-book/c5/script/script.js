var rowConverter = function(d) {
  return {
    Food: d.Food, // No conversion
    Deliciousness: parseFloat(d.Deliciousness)
  };
}

d3.csv("https://raw.githubusercontent.com/vtenpo/data/main/d3_data/csv/food.csv", function(data) {
  console.log(data);
  // generateVis();
});