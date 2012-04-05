function _drawBlips(json_path) {
  var width = svg.attr("width"),
      height = svg.attr("height"),
      center = { x: width/2, y: height/2 };

  d3.json(json_path, function (json) {
    svg.selectAll("g.quadrant")
       .each(function () { _drawBlipsFor(this, json); });
  });
};

function _drawBlipsFor(quadrant, json) {
  var quadrant = d3.select(quadrant),
      blips = json[quadrant.attr("id")] || [];

  new_blips = blips.filter(function (d) { return !d["new"]; });
  quadrant.selectAll("circle").data(new_blips).enter()
          .append("circle")
          .attr("class", "blip")
          .attr("r", 7)
          .attr("cx", function (e) { return e.x; })
          .attr("cy", function (e) { return e.y; })
          .on("mouseover", _mouseOverBlip)
          .on("mouseout", _mouseOutBlip)
          .on("click", _clickBlip);

  old_blips = blips.filter(function (d) { return d["new"]; });
  quadrant.selectAll("polygon").data(old_blips).enter()
          .append("polygon")
          .attr("class", "blip")
          .attr("points", _trianglePoints)
          .on("mouseover", _mouseOverBlip)
          .on("mouseout", _mouseOutBlip)
          .on("click", _clickBlip);

  quadrant.selectAll("text").data(blips).enter()
          .append("text")
          .attr("class", "blip")
          .attr("x", function (e) { return e.x; })
          .attr("y", function (e) { return e.y - 10; })
          .attr("dx", function (e) { return -5 * (e.name.length/2); })
          .text(function (e) { return e.name; });
}

function _trianglePoints(e) {
  var h = 15,
      up = (e.x+h/2) + "," + (e.y),
      left = (e.x) + "," + (e.y+h),
      right = (e.x+h) + "," + (e.y+h);

  return up + " " + left + " " + right;
}

function _mouseOverBlip(blip) {
  d3.select(this).transition()
                 .style("fill", "#DC143C");

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

  _drawBlips("mar_2010.json");
});

