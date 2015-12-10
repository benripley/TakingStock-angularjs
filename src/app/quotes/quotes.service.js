(function () {
    'use strict';

    angular
        .module('app.quotes')
        .factory('quoteService', quoteService);

    /* ngInject */
    function quoteService($http, quotesSettings) {

        return {
            getQuotes: getQuotes,
        };

        function getQuotes(symbols) {

            var symbolString = _.map(symbols, function(s) { return '"' + s + '"'; }).join(",");
            var url = quotesSettings.apiServiceBaseUri + '?q=select * from yahoo.finance.quotes where symbol in (' + symbolString + ')&env=http://datatables.org/alltables.env&format=json&callback=JSON_CALLBACK';
            
            return $http.jsonp(url);
        }
    }
})();