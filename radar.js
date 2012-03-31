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

function _drawBlips(svg, center, json_path) {
  d3.json(json_path, function (json) {
    svg.selectAll("circle.blip")
       .data(json["old"])
       .enter().append("circle")
               .attr("class", "blip")
               .attr("r", 7)
               .attr("cx", function (e) { return center.x + e.x; })
               .attr("cy", function (e) { return center.y + e.y; })
               .on("mouseover", _mouseOverBlip)
               .on("mouseout", _mouseOutBlip);

    svg.selectAll("polygon.blip")
       .data(json["new"])
       .enter().append("polygon")
               .attr("class", "blip")
               .attr("points", function (e) { return _trianglePoints(e, center); })
               .on("mouseover", _mouseOverBlip)
               .on("mouseout", _mouseOutBlip);
  });
};

function _trianglePoints(e, center) {
  var x = e.x + center.x,
      y = e.y + center.y,
      h = 15,
      up = (x+h/2) + "," + (y),
      left = (x) + "," + (y+h),
      right = (x+h) + "," + (y+h);

  return up + " " + left + " " + right;
}

function _mouseOverBlip() {
  d3.select(this).transition()
    .style("fill", "red");
}

function _mouseOutBlip() {
  d3.select(this).transition()
    .style("fill", "#11a5e3");
}

var width = 650,
    height = 650,
    center = { x: width/2, y: height/2 };

var svg = d3.select("#radar").append("svg")
    .attr("width", width)
    .attr("height", height);

_drawRadar(svg, center);
_drawBlips(svg, center, "jan_2010.json");

