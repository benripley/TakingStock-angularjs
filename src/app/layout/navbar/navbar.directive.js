(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    var directive = {
      restrict: 'E',
      scope: {
        extraValues: '='
      },
      templateUrl: '/app/layout/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'vm'
    };

    return directive;


    /** @ngInject */
    function NavbarController($location, configService, authService, $scope) {
      var vm = this;

      vm.isActive = isActive;
      vm.logout = logout;
      vm.authentication = authService.authentication;
      vm.changeBackend = changeBackend;
      vm.active_config = configService.active_config();
      vm.backend = configService.backend();

      // $scope.$watch('vm.active_config', function (newValue, oldValue) {
      //       console.log('vm.active_config changed.');
      //   });

      // $scope.$watch('configService.active_config()', function (newValue, oldValue) {
      //       console.log('configService.active_config changed.');
      //   });

      console.log(vm.backend);

      function isActive(path) {
        return path === $location.path();
      }

      function logout() {
        authService.logout();
      }

      function changeBackend(backend) {
        configService.changeBackend(backend);
        
        // TODO: watches?
        vm.active_config = configService.active_config();
        vm.backend = configService.backend();
      }

    }

  }

})();
