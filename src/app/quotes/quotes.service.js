(function () {
    'use strict';

    angular
        .module('app.quotes')
        .factory('quoteService', quoteService);

    /* ngInject */
    function quoteService($resource, $q, $http, quotesSettings) {

        return {
            getQuotes: getQuotes,
            symbolSuggest: symbolSuggest
        };

        function getQuotes(symbols) {

            var symbolString = _.map(symbols, function(s) { return '"' + s + '"'; }).join(",");

            var url = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (' + symbolString + ')&env=http://datatables.org/alltables.env&format=json&callback=JSON_CALLBACK';
            var deferred = $q.defer();
            $http.jsonp(url).success(function (data, status, headers, config) {
                deferred.resolve(data.query.results.quote);
            }).error(function (data, status, headers, config) {
                //this always gets called
                deferred.reject(status);
            });
            return deferred.promise;
        }

        function symbolSuggest(query) {
            return null;
        }
    }
})();