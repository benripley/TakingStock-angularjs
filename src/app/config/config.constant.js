(function () {
    'use strict';

	var configs = {};
	configs.node_development = {
		name: 'node.js',
		configuration: 'development',
		hostname: 'localhost',
		port: 8080
	};
	configs.node_production = {
		name: 'node.js',
		configuration: 'production',
		hostname: 'takingstock-nodejs.azurewebsites.net',
		port: 80
	};
	
	configs.asp5_development = {
		name: 'Asp 5',
		configuration: 'development',
		hostname: 'localhost',
		port: 9999
	};
	configs.asp5_production = {
		name: 'Asp 5',
		configuration: 'production',
		hostname: 'takingstock-asp5.azurewebsites.net',
		port: 80
	};
	
	var default_backend = 'node_development';

	angular
        .module('app.config')
        .constant('BACKEND_CONFIGURATIONS', configs)
		.constant('DEFAULT_BACKEND', default_backend);
})();