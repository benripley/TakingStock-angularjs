(function() {
  'use strict';

  angular
    .module('app.positions')
    .service('positionService', positionService);

  /** @ngInject */
  function positionService($resource) {
  	var Resource = $resource('http://localhost:8080/api/positions/:id', {id:'@id'});
    var svc = { 
    	getAll: getAll,
    	save: save,
      remove: remove
    };
    return svc;

    function getAll() {
      return Resource.query();
    }

    function save(position) {
      return Resource.save(position);
    }

    function remove(position) {
      return Resource.delete({id: position.id});
    }
  }

})();
