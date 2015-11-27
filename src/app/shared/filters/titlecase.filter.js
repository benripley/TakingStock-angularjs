(function() {
  'use strict';

  angular
    .module('app.shared')
    .filter('titlecase', titlecase);

  /** @ngInject */
  function titlecase() {
    return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
    };
  };

})();
