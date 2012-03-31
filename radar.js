function _drawBlips(json_path) {
  var width = svg.attr("width"),
      height = svg.attr("height"),
      center = { x: width/2, y: height/2 };

  d3.json(json_path, function (json) {
    svg.selectAll("circle.blip")
       .data(json["old"])
       .enter().append("circle")
               .attr("class", "blip")
               .attr("r", 7)
               .attr("cx", function (e) { return center.x + e.x; })
               .attr("cy", function (e) { return center.y + e.y; })
               .on("mouseover", _mouseOverBlip)
               .on("mouseout", _mouseOutBlip)
               .on("click", _clickBlip);

    svg.selectAll("polygon.blip")
       .data(json["new"], String)
       .enter().append("polygon")
               .attr("class", "blip")
               .attr("points", function (e) { return _trianglePoints(e, center); })
               .on("mouseover", _mouseOverBlip)
               .on("mouseout", _mouseOutBlip)
               .on("click", _clickBlip);
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

function _mouseOverBlip(blip) {
  d3.select(this).transition()
                 .style("fill", "red");

  details.select("#name").text(blip.name);
  details.select("#description").text(blip.description);
}

function _mouseOutBlip() {
  d3.select(this).transition()
                 .style("fill", "#11a5e3");

  details.select("#name").text("");
  details.select("#description").text("");
}

function _clickBlip() {
  var element = d3.select(this),
      mouseout = element.on("mouseout") ? null : _mouseOutBlip;

  element.on("mouseout", mouseout);
  _mouseOverBlip.call(this);
}

d3.xml("radar.svg", "image/svg+xml", function(xml) {
  document.getElementById("content").appendChild(xml.documentElement);

  svg = d3.select("#radar");
  details = d3.select("#blipDetails")

  _drawBlips("jan_2010.json");
});

