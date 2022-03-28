var rowConverter = function(d) { 
    return {
        "province": d.province,
        population: parseFloat(d.population),
        "GRDP-VND": parseFloat(d["GRDP-VND"]),
        area: parseFloat(d.area),
        density: parseFloat(d.density)
    };
}

d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", rowConverter, function(error, data) {
    if (error) {
        console.log(error);
    } else { 
        console.log(data);
        draw();
    }
});

function draw() {
    
}