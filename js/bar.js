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
    .attr('width', width)
    .attr('height', height)

}();