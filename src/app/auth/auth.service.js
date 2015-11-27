(function () {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', authService);

    /** @ngInject */
    function authService($http, $q, localStorageService, authSettings) {
        
        var authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false
        };

        var externalAuthData = {
            provider: "",
            userName: "",
            externalAccessToken: ""
        };

        var serviceBase = authSettings.apiServiceBaseUri;

        var service = {
            register: register,
            login: login,
            logOut: logout,
            fillAuthData: fillAuthData,
            authentication: authentication,
            refreshToken: refreshToken,
            obtainAccessToken: obtainAccessToken,
            externalAuthData: externalAuthData,
            registerExternal: registerExternal
        };

        return service;


        

        function register(registration) {

            logout();

            return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                return response;
            });

        }

        function login(loginData) {

            //var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password;

            //if (loginData.useRefreshTokens) {
            //    data = data + "&client_id=" + authSettings.clientId;
            //}

            var deferred = $q.defer();

            //$http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            $http.post(serviceBase + 'account/token?access_token=ben.ripley@gmail.com', loginData).success(function (response) {

                if (loginData.useRefreshTokens) {
                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                }
                else {
                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                }
                authentication.isAuth = true;
                authentication.userName = loginData.userName;
                authentication.useRefreshTokens = loginData.useRefreshTokens;

                deferred.resolve(response);

            }).error(function (err, status) {
                logout();
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function logout() {

            localStorageService.remove('authorizationData');

            authentication.isAuth = false;
            authentication.userName = "";
            authentication.useRefreshTokens = false;

        }

        function fillAuthData() {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                authentication.isAuth = true;
                authentication.userName = authData.userName;
                authentication.useRefreshTokens = authData.useRefreshTokens;
            }

        }

        function refreshToken() {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                if (authData.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + authSettings.clientId;

                    localStorageService.remove('authorizationData');

                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                        localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                        deferred.resolve(response);

                    }).error(function (err, status) {
                        logout();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        }

        function obtainAccessToken(externalData) {

            var deferred = $q.defer();

            $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                authentication.isAuth = true;
                authentication.userName = response.userName;
                authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                logout();
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function registerExternal(registerExternalData) {

            var deferred = $q.defer();

            $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                authentication.isAuth = true;
                authentication.userName = response.userName;
                authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                logout();
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }
})();