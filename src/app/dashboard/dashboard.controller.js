(function() {
  'use strict';

  angular
  .module('app')
  .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController(positionService, quoteService, common) {
    var vm = this;
    vm.assetAllocation = [];

  vm.lineTest = [{ 
    label: "Market Value", 
    data: [[1262304000000, 5], [1264982400000, 200], [1267401600000, 550], [1270080000000, 1129], 
    [1272672000000, 1163], [1275350400000, 1905], [1277942400000, 2002], [1280620800000, 2000], 
    [1283299200000, 2100], [1285891200000, 2200], [1288569600000, 2100], [1291161600000, 2200] ]
  }, {
    label: "Book Value",
    data: [[1262304000000, 5], [1264982400000, 232], [1267401600000, 475], [1270080000000, 553],
    [1272672000000, 675], [1275350400000, 679], [1277942400000, 789], [1280620800000, 1026], 
    [1283299200000, 1640], [1285891200000, 1892], [1288569600000, 2147], [1291161600000, 2256]]
  }];

    activate();

    function activate() {
      positionService.getAll().$promise
      .then(transformPositions)
      .then(getQuotes);
    }

    function transformPositions(positions) {
      vm.portfolio = _.chain(positions).groupBy("symbol").map(function (v, k) {
        var pos = _.map(v, function (i) { return _.omit(i, "symbol"); });
        return {
          symbol: k,
          positions: pos,
          quantity: _.reduce(pos, function (m, n) { return m + Number(n.quantity); }, 0),
          bookValue: _.reduce(pos, function (m, n) { return m + (Number(n.price) * Number(n.quantity) + Number(n.commission)); }, 0),
          totalCommissions: _.reduce(pos, function (m, n) { return m + Number(n.commission); }, 0)
        };
      }).value();
    }

    function getQuotes() {
      var symbols = _.pluck(vm.portfolio, 'symbol');
      quoteService.getQuotes(symbols)
      .then(function (quotes) {
        vm.quotes = quotes;
        _.each(symbols, function (symbol) {
          var holding = _.find(vm.portfolio, function (h) { return h.symbol == symbol; });
          var quote = _.find(quotes, function (q) { return q.symbol == symbol; });
          holding.quote = quote;
          holding.marketValue = _.reduce(holding.positions, function (m, n) { return m + (Number(n.quantity) * Number(quote.LastTradePriceOnly)); }, 0);
          holding.change = holding.quantity * Number(holding.quote.Change);
          holding.changePercent = Number(holding.quote.ChangeinPercent.replace(/[^\d.-]/g, ''));
          holding.gain = holding.marketValue - holding.bookValue;
          holding.gainPercent = holding.gain / holding.bookValue;
          holding.totalAnnualDividend = holding.quantity * Number(quote.DividendShare);
        });
        
        vm.marketValue = _.reduce(vm.portfolio, function (m, n) { return m + Number(n.marketValue); }, 0);
        vm.bookValue = _.reduce(vm.portfolio, function (m, n) { return m + Number(n.bookValue); }, 0);
        vm.change = _.reduce(vm.portfolio, function (m, n) { return m + Number(n.change); }, 0);
        vm.totalAnnualDividend = _.reduce(vm.portfolio, function (m, n) { return m + Number(n.totalAnnualDividend); }, 0);
        vm.changePercent = vm.change / vm.bookValue;
        vm.gainLoss = vm.marketValue - vm.bookValue;
        vm.gainLossPercent = vm.gainLoss / vm.bookValue;

        vm.assetAllocation = _.map(vm.portfolio, function(m) { return { label: m.quote.Name, data: m.marketValue }; });

        console.log(vm);
      });  
    }
  }
})();
