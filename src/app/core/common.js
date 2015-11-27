(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('common', common);

  /** @ngInject */
  function common($q, $rootScope, $timeout, $log) {
  	
    var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            $log: $log
        };

        return service;

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }
  }

})();