(function () {
    'use strict';

    angular
        .module('app.news')
        .factory('newsService', newsService);

    /* ngInject */
    function newsService($http, $q, newsSettings) {

        return {
            getNews: getNews
        };

        function getNews(symbols) {

            var symbolString = _.map(symbols, function(s) { return '"' + s + '"'; }).join(",");
            var url = newsSettings.apiServiceBaseUri + symbolString;

            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
})();