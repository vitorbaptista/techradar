Radar = (function (){
  function draw(element, svg_path, json_path){
    d3.xml(svg_path, 'image/svg+xml', function (xml) {
      element.appendChild(xml.documentElement);

      var svg = d3.select('#radar');

      _doRadar(svg);
      _defineBlips(svg);
      _drawBlips(svg, json_path);
    });
  }

  function _doRadar(svg) {
    var quadrants = svg.selectAll('g.quadrant')

    quadrants.select('.largest-arc')
             .on('click', function () {
               var d3_element = d3.select(this),
                   id = d3_element.attr('id'),
                   size = 800,
                   offX = 0,
                   offY = 0;

               switch (id) {
                 case 'techniques-arc':
                   break;
                 case 'tools-arc':
                   offX = -size;
                   break;
                 case 'languages-arc':
                   offX = -size;
                   offY = -size;
                   break;
                 case 'platforms-arc':
                   offY = -size;
                   break;
               }

               d3.selectAll('g#radar').transition()
                 .attr('transform', 'translate(' + offX + ',' + offY + ') scale(2)');

               d3.selectAll('text').transition()
                 .duration(800)
                 .style('opacity', '1')
             })
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
        .attr('title', function (blip) { return blip.name })
        .on('click', _showBlipDescription);

    blip.append('text')
        .text(function (blip, index) { return index; })
        .style('opacity', '0')
        .attr('class', 'label')
        .on('click', _showBlipDescription)
        .attr('transform', function (blip) {
          var blipCenter = _toRect(blip.pc);
          return 'translate(' + (center.x+blipCenter.x+5) + ', ' + (center.y+blipCenter.y-2) + ')';
        });

    return svg;
  }

  function _showBlipDescription(blip) {
    $('#blip-name').text(blip.name);
    $('#blip-description').text(blip.description);
  };

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

