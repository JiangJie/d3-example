;(function() {
  'use strict';

  var data = Array.apply(0, Array(31)).map(function(item, i) {
    i++;
    return {day: '2013-12-' + (i < 10 ? '0' + i : i), value: parseInt(Math.random() * 100)}
  });

  // 定义circle的半径
  var r0 = 5,
    r1 = 8;

  // 定义动画持续时间
  var duration = 500;

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = document.body.clientWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format('%Y-%m-%d').parse;

  var x = d3.time.scale()
    // .domain([0, 100])
    .range([0, width]);

  var y = d3.scale.linear()
    // .domain([0, 100])
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    // .tickFormat(function(d, i) {
    //   // return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
    //   // return [d.getMonth() + 1, d.getDate()].join('-');
    //   var day = d.getDate();
    //   return day < 10 ? '0' + day : day;
    // })
    // 相同的效果
    .tickFormat(d3.time.format('%d'))
    .ticks(30);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10);

  var xGridAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

  var yGridAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var line = d3.svg.line()
    .x(function(d) { return x(d.day); })
    // .y0(height)
    .y(function(d) { return y(d.value); })
    // .interpolate('linear');
    .interpolate('monotone');

  var flagLine = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  var container = d3.select('body')
    .append('svg')
    // .transition()
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  var svg;

  show(2013, 12);
  function show(year, month) {
    d3.select('g.content').remove();

    svg = container.append('g')
    .attr('class', 'content')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    function draw() {
      data.forEach(function(d) {
        d.dayText = d.day;
        d.day = parseDate(d.day);
        d.value = +d.value;
      });

      x.domain(d3.extent(data, function(d) { return d.day; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

      svg.append('text')
        .attr('class', 'title')
        .text(year + '年' + month + '月PV走势图')
        .attr('x', width / 2)
        .attr('y', 0);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .text('日期')
        .attr('transform', 'translate(' + width + ', 0)');

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        // .attr('y', 6)
        .text('次/天');

      svg.append('g')
        .attr('class', 'grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xGridAxis.tickSize(-height, 0, 0).tickFormat(''));

      svg.append('g')
        .attr('class', 'grid')
        .call(yGridAxis.tickSize(-width, 0, 0).tickFormat(''));

      var path = svg.append('path')
        // .datum(data)
        // .transitin()
        // .duration(1000)
        .attr('class', 'line')
        .attr('d', line(data));

      var g = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('g');


      g.append('circle')
        .attr('class', 'linecircle')
        .attr('cx', line.x())
        .attr('cy', line.y())
        .attr('r', r0)
        .on('mouseover', function() {
          d3.select(this).transition().duration(duration).attr('r', r1);
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(duration).attr('r', r0);
        })
        .append('title')
        .text(function(d) {
          return d.value + ' @ ' + d.dayText;
        });

      svg.append('line')
        .attr('class', 'flag')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', y(0));

      var tips = svg.append('g').attr('class', 'tips');

      tips.append('rect')
        .attr('class', 'tips-border')
        .attr('width', 200)
        .attr('height', 50)
        .attr('rx', 10)
        .attr('ry', 10);

      var wording1 = tips.append('text')
        .attr('class', 'tips-text')
        .attr('x', 10)
        .attr('y', 20)
        .text('');

      var wording2 = tips.append('text')
        .attr('class', 'tips-text')
        .attr('x', 10)
        .attr('y', 40)
        .text('');

      container
        .on('mousemove', function() {
          var m = d3.mouse(this),
            cx = m[0] - margin.left,
            cy = m[1] - 30;

          redrawLine(cx, cy);
          d3.select('.flag').style('display', 'block');
          d3.select('.tips').style('display', 'block');
        }, true)
        // .on('mouseover', function() {
        //   d3.selectAll('.flag').style('display', 'block');
        // })
        .on('mouseout', function() {
          d3.select('.flag').style('display', 'none');
          d3.select('.tips').style('display', 'none');
        });


      function redrawLine(cx, cy) {
        if(cx < 0) d3.select('.flag').style('display', 'none');
        else 
        d3.select('.flag')
          .attr('x1', cx)
          .attr('x2', cx)
          .style('display', 'block');

        // showTips(cx, cy);
        showWording(cx);
      }

      function showTips(cx, cy) {
        cy -= 50;
        if(cy < 0) cy += 100;
        d3.select('.tips')
          .attr('transform', 'translate(' + cx + ',' + cy + ')')
          .style('display', 'block');
      }

      function showWording(cx) {
        var x0 = x.invert(cx);
        var i = (d3.bisector(function(d) {
          return d.day;
        }).left)(data, x0, 1);

        var d0 = data[i - 1],
          d1 = data[i] || {},
          d = x0 - d0.day > d1.day - x0 ? d1 : d0;

        function formatWording(d) {
          return '日期：' + d3.time.format('%Y-%m-%d')(d.day);
        }
        wording1.text(formatWording(d));
        wording2.text('PV：' + d.value);

        var x1 = x(d.day),
          y1 = y(d.value);


        // 处理超出的情况
        var dx = x1 > width ? x1 - width + 200 : x1 + 200 > width ? 200 : 0;

        var dy = y1 > height ? y1 - height + 50 : y1 + 50 > height ? 50 : 0;
        
        x1 -= dx;
        y1 -= dy;

        d3.select('.tips')
          .attr('transform', 'translate(' + x1 + ',' + y1 + ')');
      }
    }

    // window.setInterval(function() {
    //   data.push(data.shift());
    //   draw();
    // }, 1000);

    draw();
  }

  // window.onresize = function() {
  //   // 缩放svg
  //   svg.attr("transform", "scale(" + $(window).height / width + ")");
  // }
})();