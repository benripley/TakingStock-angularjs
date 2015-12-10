(function() {
  'use strict';

  angular
    .module('app.positions')
    .service('positionService', positionService);

  /** @ngInject */
  function positionService($http, configService) {
    var apiServiceBaseUri = 'http://' + configService.backend().hostname + ':' + configService.backend().port + '/api/positions';
    var svc = { 
      all: all,
      save: save,
      remove: remove,
      changeBackend: changeBackend,
      backend: configService.backend
    };
    return svc;

    function changeBackend(backend) {
      apiServiceBaseUri = 'http://' + configService.backend().hostname + ':' + configService.backend().port + '/api/positions';
    }
    
    function all() {
      return $http.get(apiServiceBaseUri)
      .then(function (positions) {
        return _.chain(positions.data).groupBy("symbol").map(function (v, k) {
          var pos = _.map(v, function (i) { return _.omit(i, "symbol"); });
          return {
            symbol: k,
            positions: pos,
            quantity: _.reduce(pos, function (m, n) { return m + Number(n.quantity); }, 0),
            bookValue: _.reduce(pos, function (m, n) { return m + (Number(n.price) * Number(n.quantity) + Number(n.commission)); }, 0),
            totalCommissions: _.reduce(pos, function (m, n) { return m + Number(n.commission); }, 0)
          };
        }).value();
      });
    }

    function save(position) {
      return $http.post(apiServiceBaseUri, position);
    }

    function remove(position) {
      return Resource.delete({id: position.id});
    }
  }

})();
