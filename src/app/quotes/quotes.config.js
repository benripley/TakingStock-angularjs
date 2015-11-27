(function () {
    'use strict';

    var serviceBase = 'https://query.yahooapis.com/v1/public/yql';
    
    angular
        .module('app.quotes')
        .constant('quotesSettings', {
            apiServiceBaseUri: serviceBase
        });
})();