(function () {
    'use strict';

    var serviceBase = 'http://localhost:8080/';

    angular
        .module('app.auth')
		.config(function ($httpProvider) {
		    $httpProvider.interceptors.push('authInterceptorService');
		})
        .constant('authSettings', {
            apiServiceBaseUri: serviceBase
        });
})();