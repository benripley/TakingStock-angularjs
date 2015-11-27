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
        extraValues: '=',
      },
      templateUrl: '/app/layout/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function NavbarController($location, authService) {
      var vm = this;

      vm.isActive = isActive;
      console.log(authService);
      vm.authentication = authService.authentication;

      function isActive(path) {
        return path === $location.path();
      }

    }

  }

})();
