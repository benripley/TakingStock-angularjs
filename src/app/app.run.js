(function () {
    'use strict';

    angular.module('app')
    	.run(runBlock);

	/* ngInject */
    function runBlock(authService) {
		authService.fillAuthData();
    }
})();