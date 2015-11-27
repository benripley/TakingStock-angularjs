(function() {
  'use strict';

  angular
  .module('app.flot')
  .directive('pieChart', pieChart);

  /** @ngInject */
  function pieChart() {
    var directive = {
      restrict: 'E',
      link: function(scope, elem, attrs) {

        var chart = null;
        var opts  = {   
          series: {
            pie: {
              show: true,  
              innerRadius: 0, 
              stroke: { width: 4 }
            }
          },
          legend: { show: false }, // { show: true, position: 'ne' }, 
          tooltip: true,
          tooltipOpts: { content: '%s: %y' },
          grid: { hoverable: true },
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
