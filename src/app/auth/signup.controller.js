(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller("SignupController", SignupController);

    /* ngInject */
    function SignupController(authService, authSettings, common, $location) {
        var vm = this;
        vm.agree = false;
        vm.savedSuccessfully = false;
        vm.message = "";

        vm.registration = {
            userName: "",
            password: "",
            confirmPassword: ""
        };

        vm.signUp = function () {

            authService.register(vm.registration)
            .then(function (response) {
                vm.savedSuccessfully = true;
                vm.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
                startTimer();

            },
            function (response) {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 vm.message = "Failed to register user due to:" + errors.join(' ');
             });
        };

        var startTimer = function () {
            var timer = common.$timeout(function () {
                common.$timeout.cancel(timer);
                $location.path('/login');
            }, 2000);
        };
    }
})();