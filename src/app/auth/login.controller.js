(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller("LoginController", LoginController);

    /* ngInject */
    function LoginController($location, authService, authSettings) {
        var vm = this;

        vm.login = login;
        vm.authExternalProvider = authExternalProvider;
        vm.authCompletedCB = authCompletedCB;

        vm.loginData = {
            username: "",
            password: "",
            useRefreshTokens: false
        };

        vm.message = "";

        function login() {
            authService.login(vm.loginData).then(function (response) {
                $location.path('/dashboard');
            },
             function (err) {
                 vm.message = err.error_description;
             });
        }

        function authExternalProvider(provider) {

            var redirectUri = $location.protocol + '//' + $location.host + '/authcomplete.html';

            var externalProviderUrl = authSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=" + authSettings.clientId + "&redirect_uri=" + redirectUri;
            window.$windowScope = vm;

            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        }

        function authCompletedCB(fragment) {
            vm.$apply(function () {

                if (fragment.haslocalaccount == 'False') {

                    authService.logOut();

                    authService.externalAuthData = {
                        provider: fragment.provider,
                        userName: fragment.external_user_name,
                        externalAccessToken: fragment.external_access_token
                    };

                    $location.path('/associate');

                }
                else {
                    //Obtain access token and redirect to orders
                    var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                    authService.obtainAccessToken(externalData).then(function (response) {

                        $location.path('/dashboard');

                    },
                 function (err) {
                     vm.message = err.error_description;
                 });
                }
            });
        }
    }
})();