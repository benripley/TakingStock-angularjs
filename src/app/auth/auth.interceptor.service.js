(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('authInterceptorService', authInterceptorService);

    /** @ngInject */
    function authInterceptorService($q, $injector, $location, localStorageService) {
        var service = {
            request: request,
            responseError: responseError,
        };

        return service;

        function request(config) {
            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'bearer ' + authData.token; // lowercase? 
            }

            return config;
        }

        function responseError(rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                var authData = localStorageService.get('authorizationData');

                if (authData) {
                    if (authData.useRefreshTokens) {
                        $location.path('/refresh');
                        return $q.reject(rejection);
                    }
                }
                authService.logOut();
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    }
})();