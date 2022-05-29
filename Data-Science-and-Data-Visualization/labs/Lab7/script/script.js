var width = 500;
var height = 800;

// Define quantize scale to sort data values into buckets of color
var color = d3.scaleQuantize()
  .range(["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"]);

var active = d3.select(null);

var rowConverter = function (d) {
  return {
    ma: parseInt(d.ma),
    area: parseFloat(d.area / 1000),
  };
};

d3.csv("https://raw.githubusercontent.com/vtenpo/Web/main/Data-Science-and-Data-Visualization/labs/Lab7/data/vn-provinces-data.csv", rowConverter, function (error, data) {
  if (error) {
    console.log(error);
  } else {
    console.log(data);

    // Set input domain for color scale
    color.domain([d3.min(data, function (d) { return d.area; }), 
                  d3.max(data, function (d) { return d.area; }),]);

    d3.json("https://raw.githubusercontent.com/vtenpo/Web/main/Data-Science-and-Data-Visualization/labs/Lab7/json/vn-provinces.json", function (json) {
      var zoom = d3.zoom() .scaleExtent([1, 9]).on("zoom", zoomed);

      function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scaleb = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
          translate = [width / 2 - scaleb * x, height / 2 - scaleb * y,];

        map.transition().duration(500).call(zoom.transform, 
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
      }

      function reset() {
        active.classed("active", false);
        active = d3.select(null);
        map.transition().duration(750).call(zoom.transform, d3.zoomIdentity); 
      }

      function zoomed() {
        mapg.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        mapg.attr("transform", d3.event.transform);
      }

      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      }

      var map = d3.select("#vietnamMap").append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", stopped, true);

      var mapg = map.append("g");
      map.call(zoom);
        
      var center = d3.geoCentroid(json);
      var scale = 500;
      var offset = [width / 2, height / 2];
      var projection = d3.geoMercator().scale(scale).center(center).translate(offset);
      var path = d3.geoPath().projection(projection);
      var bounds = path.bounds(json);
      var hscale = (scale * width) / (bounds[1][0] - bounds[0][0]);
      var vscale = (scale * height) / (bounds[1][1] - bounds[0][1]);
      var scale = hscale < vscale ? hscale : vscale;
      var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                    height - (bounds[0][1] + bounds[1][1]) / 2, ];

      projection = d3.geoMercator().center(center).scale(scale).translate(offset);
      path = path.projection(projection);

      map.append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .on("click", reset);

      for (var i = 0; i < data.length; i++) {
        var dataProvinceCode = data[i].ma;
        var dataArea = data[i].area;
        for (var j = 0; j < json.features.length; j++) {
          var jsonProvinceCode = Number(json.features[j].properties.Ma);
            if (dataProvinceCode == jsonProvinceCode) {
              json.features[j].properties.area = dataArea;
              break;
            }
        }
      }

      mapg.selectAll("path").data(json.features).enter().append("path")
        .attr("d", path)
        .attr("class", "feature")
        .style("fill", function (d) {
          var value = d.properties.area;
          if (value) return color(value);
          else return "#ccc";
        })
        .style("stroke-width", "0.25")
        .style("stroke", "black")
        .on("click", clicked);

      mapg.append("path").datum(json.features)
        .attr("d", path)
        .attr("class", "mesh");

      var lg = map.selectAll("g.legendEntry").data(color.range().reverse()).enter().append("g")
        .attr("class", "legendEntry");

      lg.append("rect")
        .attr("x", width - 150)
        .attr("y", function (d, i) { return i * 20; })
        .attr("width", 10)
        .attr("height", 10)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function (d) { return d; });

      lg.append("text")
        .attr("x", width - 130) 
        .attr("y", function (d, i) { return i * 20; })
        .attr("dy", "0.8em") 
        .text(function (d, i) {
          var extent = color.invertExtent(d);
          var format = d3.format("0.0f");
          return (format(+extent[0] * 1000) + " - " + format(+extent[1] * 1000));
        });
    }); // end d3.json("../json/vn-provinces.json")
  } // end if 
}); // end d3.csv("../data/vn-provinces-data.csv")


var rowConverter1 = function (d) {
  return {
      ["ma"]: parseInt(d.ma),
      ["confirmed-cases"]: parseInt(d["confirmed-cases"]),
  };
};


d3.csv(
  "https://raw.githubusercontent.com/nmtrang/data-csv/master/covid-confirmed-cases-in-vn.csv",
  rowConverter1,
  function (error, data) {
      if (error) {
          console.log(error);
      } else {
          console.log(data);

          //Set input domain for color scale
          colorForCovid.domain([
              d3.min(data, function (d) {
                  return d["confirmed-cases"];
              }),
              d3.max(data, function (d) {
                  return d["confirmed-cases"];
              }),
          ]);

          d3.json(
              "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json",
              function (json) {
                  // zoom function
                  var zoom = d3
                      .zoom()
                      // .translate([0, 0])
                      // .scale(1)
                      .scaleExtent([1, 9])
                      .on("zoom", zoomed);

                  function clicked(d) {
                      if (active.node() === this) return reset();
                      active.classed("active", false);
                      active = d3.select(this).classed("active", true);

                      var bounds = path.bounds(d),
                          dx = bounds[1][0] - bounds[0][0],
                          dy = bounds[1][1] - bounds[0][1],
                          x = (bounds[0][0] + bounds[1][0]) / 2,
                          y = (bounds[0][1] + bounds[1][1]) / 2,
                          scale1 = Math.max(
                              1,
                              Math.min(
                                  8,
                                  0.9 / Math.max(dx / width, dy / height)
                              )
                          ),
                          translate = [
                              width / 2 - scale1 * x,
                              height / 2 - scale1 * y,
                          ];

                      covidvis
                          .transition()
                          .duration(500)
                          // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
                          .call(
                              zoom.transform,
                              d3.zoomIdentity
                                  .translate(translate[0], translate[1])
                                  .scale(scale1)
                          ); // updated for d3 v4
                  }

                  function reset() {
                      active.classed("active", false)
                      active = d3.select(null);

                      covidvis
                          .transition()
                          .duration(750)
                          // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
                          .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
                  }

                  function zoomed() {
                      g.style(
                          "stroke-width",
                          1.5 / d3.event.transform.k + "px"
                      );
                      // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
                      g.attr("transform", d3.event.transform); // updated for d3 v4
                  }

                  // If the drag behavior prevents the default click,
                  // also stop propagation so we don’t click-to-zoom.
                  function stopped() {
                      if (d3.event.defaultPrevented)
                          d3.event.stopPropagation();
                  }

                  var covidvis = d3
                      .select("#covidmapinvn")
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      .on("click", stopped, true);

                  // create a first guess for the projection
                  var center = d3.geoCentroid(json);
                  var scale = 500;
                  var offset = [width / 2, height / 2];
                  var projection = d3
                      .geoMercator()
                      .scale(scale)
                      .center(center)
                      .translate(offset);

                  // create the path
                  var path = d3.geoPath().projection(projection);

                  // using the path determine the bounds of the current map and use
                  // these to determine better values for the scale and translation
                  var bounds = path.bounds(json);
                  var hscale =
                      (scale * width) / (bounds[1][0] - bounds[0][0]);
                  var vscale =
                      (scale * height) / (bounds[1][1] - bounds[0][1]);
                  var scale = hscale < vscale ? hscale : vscale;
                  var offset = [
                      width - (bounds[0][0] + bounds[1][0]) / 2,
                      height - (bounds[0][1] + bounds[1][1]) / 2,
                  ];

                  // new projection
                  projection = d3
                      .geoMercator()
                      .center(center)
                      .scale(scale)
                      .translate(offset);
                  path = path.projection(projection);

                  // add a rectangle to see the bound of the svg
                  covidvis
                      .append("rect")
                      .attr("width", width)
                      .attr("height", height)
                      .style("fill", "none")
                      .on("click", reset);

                  var g = covidvis.append("g");
                  covidvis.call(zoom);

                  //Merge the ag. data and GeoJSON
                  //Loop through once for each ag. data value
                  for (var i = 0; i < data.length; i++) {
                      //Grab province code
                      var dataProvinceCode = data[i].ma;

                      //Grab confirmed cases value
                      var dataCases = data[i]["confirmed-cases"];

                      //Find the corresponding province code inside the GeoJSON
                      for (var j = 0; j < json.features.length; j++) {
                          var jsonProvinceCode = Number(
                              json.features[j].properties.Ma
                          );

                          if (dataProvinceCode == jsonProvinceCode) {
                              //Copy the data value into the JSON
                              json.features[j].properties.cases = dataCases;
                              //Stop looking through the JSON
                              break;
                          }
                      }
                      console.log(json);
                  }

                  g.selectAll("path")
                      .data(json.features)
                      .enter()
                      .append("path")
                      .attr("d", path)
                      .attr("class", "feature")
                      .style("fill", function (d) {
                          var value = d.properties.cases;

                          if (value) {
                              //If value exists…
                              return colorForCovid(value);
                          } else {
                              //If value is undefined…
                              return "#ccc";
                          }
                      })
                      .style("stroke-width", "0.25")
                      .style("stroke", "black")
                      .on("click", clicked);

                  g.append("path")
                      .datum(json.features)
                      .attr("d", path)
                      .attr("class", "mesh");

                  

                  // legend
                  var legend = covidvis
                      .selectAll("g.legendEntry")
                      .data(colorForCovid.range().reverse())
                      .enter()
                      .append("g")
                      .attr("class", "legendEntry");

                  legend
                      .append("rect")
                      .attr("x", width - 150)
                      .attr("y", function (d, i) {
                          return i * 20;
                      })
                      .attr("width", 10)
                      .attr("height", 10)
                      .style("stroke", "black")
                      .style("stroke-width", 1)
                      .style("fill", function (d) {
                          return d;
                      });
                  //the data objects are the fill colors

                  legend
                      .append("text")
                      .attr("x", width - 130) //leave 5 pixel space after the <rect>
                      .attr("y", function (d, i) {
                          return i * 20;
                      })
                      .attr("dy", "0.8em") //place text one line *below* the x,y point
                      .text(function (d, i) {
                          var extent = colorForCovid.invertExtent(d);
                          //extent will be a two-element array, format it however you want:
                          var format = d3.format("0.0f");
                          return (
                              format(+extent[0]) + " - " + format(+extent[1])
                          );
                      });
              }
          );
      }
  }
);