(function() {
  'use strict';

  var app = angular.module('app', 
  	[
    	'app.core', 
      'app.config',
      'app.shared',
    	'app.layout', 
    	'app.positions', 
      'app.quotes',
      'app.news',
    	'app.auth',
    	'app.flot',
      'highcharts-ng'
    ]);

  app.config(['highchartsNGProvider', function (highchartsNGProvider) {
    highchartsNGProvider.lazyLoad();// will load hightcharts (and standalone framework if jquery is not present) from code.hightcharts.com
  }]);

})();
