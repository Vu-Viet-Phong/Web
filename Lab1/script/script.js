function addEltToSVG(svg, name, attrs)	{
    var element = document.createElementNS("http://www.w3.org/2000/svg", name);
    
    if (attrs === undefined) attrs = {};
    
    for (var key in attrs) {
        element.setAttributeNS(null, key, attrs[key]);
    }
    
    svg.appendChild(element);
}
    
function createHistogram(svg, name) {
    var arr = [0,0,0,0,0,0]; 

    name = name.toLowerCase();
                    
    for (var i = 0; i < name.length; i++) {
        var code = name.charCodeAt(i);
        if (code >= 97 && code < 101) arr[0]++;
        if (code >= 101 && code < 105) arr[1]++;
        if (code >= 105 && code < 109) arr[2]++;
        if (code >= 109 && code < 113) arr[3]++;
        if (code >= 113 && code < 118) arr[4]++;
        if (code >= 118 && code < 123) arr[5]++;
    }
        
    for (var i in arr) {
        var attrs = {"x": 50 * i, "y": 165, "height": arr[i] * 50, "width": 50, "fill": "blue", "stroke": "black"};
        if (attrs.height === 0) attrs.height = 1;
        addEltToSVG(svg, "rect", attrs);
    }                
}

var svgElement = document.getElementById("histogram");
createHistogram(svgElement, "Phong");