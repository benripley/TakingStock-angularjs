(function() {
  'use strict';

  angular
    .module('app.quotes')
    .directive('symbolSuggest', symbolSuggest);

  symbolSuggest.$inject = ['$timeout'];

  /** @ngInject */
  function symbolSuggest($timeout) {
    var directive = {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        select: "&",
        term: "="
      },
      // link: function(scope, element, attrs, controller) {
      //   var $input = element.find('form > input');
      //   var $list = element.find('> div');

      //   $input.bind('focus', function() {
      //     scope.$apply(function() { scope.focused = true; });
      //   });

      //   $input.bind('blur', function() {
      //     scope.$apply(function() { scope.focused = false; });
      //   });

      //   $list.bind('mouseover', function() {
      //     scope.$apply(function() { scope.mousedOver = true; });
      //   });

      //   $list.bind('mouseleave', function() {
      //     scope.$apply(function() { scope.mousedOver = false; });
      //   });

      //   $input.bind('keyup', function(e) {
      //     if (e.keyCode === 9 || e.keyCode === 13) {
      //       scope.$apply(function() { controller.selectActive(); });
      //     }

      //     if (e.keyCode === 27) {
      //       scope.$apply(function() { scope.hide = true; });
      //     }
      //   });

      //   $input.bind('keydown', function(e) {
      //     if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
      //       e.preventDefault();
      //     };

      //     if (e.keyCode === 40) {
      //       e.preventDefault();
      //       scope.$apply(function() { controller.activateNextItem(); });
      //     }

      //     if (e.keyCode === 38) {
      //       e.preventDefault();
      //       scope.$apply(function() { controller.activatePreviousItem(); });
      //     }
      //   });

      //   scope.$watch('items', function(items) {
      //     controller.activate(items.length ? items[0] : null);
      //   });

      //   scope.$watch('focused', function(focused) {
      //     if (focused) {
      //       $timeout(function() { $input.focus(); }, 0, false);
      //     }
      //   });

      //   scope.$watch('isVisible()', function(visible) {
      //     if (visible) {
      //       var pos = $input.position();
      //       var height = $input[0].offsetHeight;

      //       $list.css({
      //         top: pos.top + height,
      //         left: pos.left,
      //         position: 'absolute',
      //         display: 'block'
      //       });
      //     } else {
      //       $list.css('display', 'none');
      //     }
      //   });
      // },
      templateUrl: '/app/quotes/symbolSuggest/symbolSuggest.html',
      controller: SymbolSuggestController,
      controllerAs: 'vm'
    };

    return directive;


    SymbolSuggestController.$inject = ['$scope'];

    /** @ngInject */
    function SymbolSuggestController($scope) {
      var vm = this;
      vm.items = [];

      vm.query = query;
      vm.selectItem = selectItem;


      function selectActive() {
        this.select(vm.active);
          
      };

      function selectItem(item) {
        vm.hide = true;
        vm.focused = true;
        vm.active = item;
        $scope.select({item: vm.active});
        
        vm.items = [];
        $scope.term = '';
      };

      function query() {
        vm.hide = false;

        // TODO: would be very interested if anyone knows a better way to do this.
        // http://stackoverflow.com/questions/31420763/angular-jsonp-yahoo-finance-symbolsuggest
        window.YAHOO = {
            Finance: {
                SymbolSuggest: {
                  ssCallback: function (data) {
                    vm.items = data.ResultSet.Result.slice(0,7); // take 7 (of 10) for now
                    $scope.$apply();
                  }
                }
            }
        };

        if($scope.term.length >= 2) {
          $.ajax({
            type: "GET",
            url: "http://d.yimg.com/aq/autoc",
            data: {query: $scope.term, region:'US', lang:'en-US' },
            dataType: "jsonp",
            jsonp : "callback",
            jsonpCallback: "YAHOO.Finance.SymbolSuggest.ssCallback",
          });       
        }
      }
    }
  }

})();