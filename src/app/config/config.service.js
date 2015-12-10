(function() {
  'use strict';

  angular
    .module('app.config')
    .service('configService', configService);

  /** @ngInject */
  function configService(BACKEND_CONFIGURATIONS, DEFAULT_BACKEND) {
    
    var active_config = DEFAULT_BACKEND;

    var svc = {
      active_config: function() {
        return active_config;
      },
      backend: function() { 
        return BACKEND_CONFIGURATIONS[active_config]; 
      },
    	changeBackend: changeBackend
    };

    return svc;

    function changeBackend(backend) {     
      var environment = location.hostname === 'localhost' ? 'development' : 'production';

      console.log('changing active_config to ' + backend + ' (' + environment + ')');

      if(backend === 'node') {
          active_config = 'node_' + environment;
      } else if (backend === 'asp5') {
          active_config = 'asp5_' + environment;
      }

      console.log('configService after');
      console.log(active_config);
      console.log(BACKEND_CONFIGURATIONS[active_config]);
    }
  }

})();