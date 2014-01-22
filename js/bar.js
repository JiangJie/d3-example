!function(){
  'use strict';

  var data = Array.apply(0, Array(30)).map(function() {
    return Math.random() * 100;
  });

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = document.body.clientWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

  var chart = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  var barWidth = width / data.length;

  var bar = chart.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
      return 'translate(' + i * barWidth + ', 0)';
    });

  bar.append('rect')
    .attr('y', function(d) {
      return height - d;
    })
    .attr('height', function(d) {
      return d;
    })
    .attr('width', barWidth - 1);

}();