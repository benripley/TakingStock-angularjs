(function() {
  'use strict';

  angular
  .module('app.flot')
  .directive('lineChart', lineChart);

  /** @ngInject */
  function lineChart() {
    var directive = {
      restrict: 'E',
      link: function(scope, elem, attrs) {

        var chart = null;
        
        var opts = {
          xaxis: {
            min: (new Date(2009, 12, 1)).getTime(),
            max: (new Date(2010, 11, 2)).getTime(),
            mode: "time",
            tickSize: [2, "month"],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            tickLength: 0
          },
          yaxis: {

          },
          series: {
            lines: {
              show: true, 
              fill: false,
              lineWidth: 3
            },
            points: {
              show: true,
              radius: 3,
              fill: true,
              fillColor: "#ffffff",
              lineWidth: 2
            }
          },
          grid: { 
            show: false,
            hoverable: true
          },
          legend: {
            show: true, position: 'nw'
          },
          tooltip: true,
          tooltipOpts: {
            content: '%s: %y'
          },
          colors: ['#D74B4B', '#475F77', '#BCBCBC', '#777777', '#6685a4', '#E68E8E']
        };

        scope.$watch(attrs.ngModel, function(v) {
          if(v && v.length) {
            if(!chart) {
              chart = $.plot(elem, v , opts);
              elem.show();
            } else {
              chart.setData(v);
              chart.setupGrid();
              chart.draw();
            }
          }
        });
      }
    }

    return directive;
  }

})();
