Radar = (function (){
  function draw(element, svg_path, json_path){
    d3.xml(svg_path, 'image/svg+xml', function (xml) {
      element.appendChild(xml.documentElement);

      var svg = d3.select('#radar');

      _defineBlips(svg);
      _drawBlips(svg, json_path);
    });
  }

  function _defineBlips(svg) {
    var definitions = svg.append('defs');

    definitions.append('circle')
               .attr('r', 4)
               .attr('class', 'unchanged blip')
               .attr('id', 'circular-blip');

   definitions.append('polygon')
              .attr('points', '-2,-2 8,-2 3,-10')
              .attr('class', 'changed blip')
              .attr('id', 'triangular-blip');

    return svg;
  }

  function _drawBlips(svg, json_path) {
    d3.json(json_path, function (blipData) {
      _drawBlipsUpon(svg, blipData);
    });
  }

  function _drawBlipsUpon(svg, blipData) {
    var center = _centerOf(svg),
        blips = svg.selectAll('.blip-container')
                   .data(blipData);
        blip = blips.enter()
                    .append('g')
                    .attr('class', 'blip-container');
    blip.append('use')
        .attr('xlink:href', function (blip) {
          return blip.movement == 'c' ? '#circular-blip' : '#triangular-blip';
        })
        .attr('x', function (blip){
          return center.x + _toRect(blip.pc).x;
        })
        .attr('y', function (blip){
          return center.y + _toRect(blip.pc).y;
        })
        .attr('title', function (blip) { return blip.name });

    blip.append('text')
        .text(function (blip, index) { return index; })
        .attr('class', 'label')
        .attr('transform', function (blip) {
          var blipCenter = _toRect(blip.pc);
          return 'translate(' + (center.x+blipCenter.x+5) + ', ' + (center.y+blipCenter.y-2) + ')';
        });

    return svg;
  }

  function _centerOf(d3_element) {
    var element = document.getElementById(d3_element.attr('id')),
        bbox = element.getBBox();

    return _point(bbox.width / 2, bbox.height / 2);
  }

  function _point(x, y) {
    return {
      'x': x,
      'y': y
    };
  }

  function _toRect(polarCoords) {
    var angleInRadians = polarCoords.t / (2*Math.PI);
    function xProjection(r,a) { return r * Math.cos(a); }
    function yProjection(r,a) { return r * Math.sin(a); }
    return _point(xProjection(polarCoords.r, angleInRadians), yProjection(polarCoords.r, angleInRadians));
  }

  return {
    draw: draw
  };
})();

