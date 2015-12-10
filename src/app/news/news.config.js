(function () {
    'use strict';

    var serviceBase = 'http://feeds.finance.yahoo.com/rss/2.0/headline?region=US&lang=en-US&s='; //s=AAPL,GOOG
    
    angular
        .module('app.news')
        .constant('newsSettings', {
            apiServiceBaseUri: serviceBase
        });
})();