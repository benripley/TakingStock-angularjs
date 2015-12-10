(function() {
  'use strict';

  angular
  .module('app')
  .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController(positionService, quoteService, newsService, common) {
    var vm = this;
    vm.assetAllocation = [];
    vm.news = [];

    vm.symbolPicked = symbolPicked;
    vm.addPosition = addPosition;
    vm.symbol = null;
    vm.date = new Date();
    vm.quantity = 0;
    vm.price = 0;
    vm.commission = 0;

    activate();

    function activate() {
      
      positionService.all()
        .then(function (positions) { vm.portfolio = positions })
        .then(getQuotes)
        .then(getNews)
        .catch(function(e) {
          console.error('An error occurred: ', e);
        });

      $('#addPositionModal').modal('hide');
    }

    

    function getQuotes() {
      var symbols = _.pluck(vm.portfolio, 'symbol');
      quoteService.getQuotes(symbols)
      .then(function (quotes) {
        vm.quotes = quotes.data.query.results.quote;
        _.each(symbols, function (symbol) {
          var holding = _.find(vm.portfolio, function (h) { return h.symbol == symbol; });
          var quote = _.find(vm.quotes, function (q) { return q.symbol == symbol; });
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

        var aaData = _.map(vm.portfolio, function(m) { return { name: titleCase(m.quote.Name), y: m.marketValue }; });

        Highcharts.getOptions().colors = ['#D74B4B', '#475F77', '#BCBCBC', '#777777', '#6685a4', '#E68E8E'];
        vm.assetAllocation = {
          options: {
            chart: {
              type: 'pie'
            },
            tooltip: {
              pointFormat: '<b>${point.y:.0f} ({point.percentage:.1f}%)</b>'
            },
            plotOptions: {
              series: {
                allowPointSelect: true,
                events: {
                  click: function (event) {
                    console.log(event);
                    console.log(this);
                  },
                  legendItemClick: function () {
                        var visibility = this.visible ? 'visible' : 'hidden';
                        if (!confirm('The series is currently ' +
                                     visibility + '. Do you want to change that?')) {
                            return false;
                        }
                    }
                }
              }
            }
          },
          series: [{
            name: '',
            data: aaData,
            showInLegend: true,
            dataLabels: {
                enabled: false
            }
          }],
          title: {
            text: null
          },
          loading: false
        };

        console.log(vm);
      });  
    }

    function getNews() {
      var symbols = _.pluck(vm.portfolio, 'symbol');
      var promise = newsService.getNews(symbols);

      promise.then(
        function(newsfeed) { 
          var take = newsfeed.data.responseData.feed.entries.length;
          if(take > 7) take = 7;

          vm.news = newsfeed.data.responseData.feed.entries.slice(0,take);
        },
        function(err) {
          common.$log.error('failure loading news', err);
        });
    }

    function symbolPicked(item) {
      console.log(item.name);
      vm.symbol = item;
    }

    function addPosition() {
      var position = {
        quantity: vm.quantity,
        price: vm.price,
        commission: vm.commission,
        symbol: vm.symbol.symbol
      };

      positionService.save(position)
      .then(function (response) {
        activate();
      },
      function (err) {
        console.error(err);
      });
    }

    function titleCase(s) {
      s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
    }
  }
})();
