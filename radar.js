function _drawRadar(svg, center) {
  var maxRadius = svg.attr("width") / 2 - 5,
      steps = [5, 50, 55, 120, 220];

  for (i in steps) {
    var radius = maxRadius - steps[i];
    svg.append("circle")
       .attr("class", "radar")
       .attr("r", radius)
       .attr("cx", center.x)
       .attr("cy", center.y);
  }

  svg.append("line")
     .attr("x1", center.x)
     .attr("y1", 0)
     .attr("x2", center.x)
     .attr("y2", svg.attr("height"));

  svg.append("line")
     .attr("x1", 0)
     .attr("y1", center.y)
     .attr("x2", svg.attr("width"))
     .attr("y2", center.y);
};

var width = 650,
    height = 650,
    center = { x: width/2, y: height/2 };

var svg = d3.select("#radar").append("svg")
    .attr("width", width)
    .attr("height", height);

_drawRadar(svg, center);

