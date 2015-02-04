!function(){
  'use strict';

  var data = Array.apply(0, Array(100)).map(function() {
    return Math.random() * 100;
  });

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = document.body.clientWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .domain([0, 100])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(1);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var chart = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  chart.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  // 计算每根柱状物体的宽度
  var barWidth = width / data.length;
  // 用g作每根柱状物体的容器，意义可类比div
  // 前一篇文章已经介绍过selectAll的意义，即生成占位符，等待填充svg图形
  var bar = chart.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    // 接收一个数据填充一个g元素
    // 同时为g设置位置
    // 前文提到svg的元素定位都是基于整个svg容器左上角作为原点，但并不能使用position: absolute等方法定位
    // 此处的g元素通过位移来定位
    .attr('transform', function(d, i) {
      console.log(i - 14);
      return 'translate(' + (i - 14) * barWidth + ', 0)';
    });
  // 这里的bar可类比jQuery对象，是一个类数组对象
  // bar调用的方法都会对bar里面每个对象进行调用
  bar.append('rect')
    // 添加一个矩形
    .attr('y', function(d) {
      return height - d;
    })
    .attr('height', function(d) {
      return d;
    })
    .attr('width', barWidth - 1);

}();

(function n(n) {
  var m = Math.pow(2, n);

  var s1 = '<td>1</td>',
    s0 = '<td>0</td>';

  var s = Array.apply(null, Array(m)).map(function(item, j) {
    
    return '<tr>' + Array.apply(null, Array(n)).map(function(item, i) {
      i++;

      // 每列开始l个1
      var l = m / Math.pow(2, i);

      // 1
      if(Math.floor(j / l) % 2 == 0) return s1;
      return s0;
    }).join('') + '</tr>';
  }).join('');

  s = '<table>' + s + '</table>';
  console.log(s);
  document.write(s);


})(3);