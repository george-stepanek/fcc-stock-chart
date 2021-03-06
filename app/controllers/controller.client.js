'use strict';

(function () {
   
   google.load("visualization", "1", {packages:["corechart"]});
   
   var colors = ['blue', 'green', 'purple', 'orange', 'black'];
   var stocks = [];
   
   function refreshStocks () {
      $.get(window.location.origin + '/api/stocks/', function (results) {
         var temp = results.map(function(obj) { 
            return obj.code;
         });
         if(temp.length != stocks.length) {
            stocks = temp;
            displayStocks();
         }
      });      
   }
   
   $(document).ready(function () {
      refreshStocks();
      var socket = io(window.location.origin);
      socket.on('event', refreshStocks);
   });
   
   $('input').keypress(function (e) {
      if(e.keyCode == 13) {
         $('.find-stock').click();
      }
   });

   $('.find-stock').click(findStock);
   $(window).on('resize', displayStocks);
      
   function findStock () {
      
      var code = $('input').val().toUpperCase();
      $('input').val('');
      
      var apiUrl = "https://www.quandl.com/api/v3/datasets/WIKI/" + code +
         ".json?start_date=2015-01-01&end_date=2016-01-01&order=asc&column_index=4&api_key=yxUrG7eH5x2MHTCQG_1M";

      $.ajax({url: apiUrl, async: false, success: function(results) {
         if(stocks.length == colors.length) {
            var removed = stocks.shift();
            $.ajax({url: window.location.origin + '/api/stock/' + removed, type: 'DELETE', success: function (result) { }});
            colors.push(colors.shift());
         }
         
         $.post(window.location.origin + '/api/stock/' + code, function (result) { });
         stocks.push(code);
         displayStocks();
      }, error: function (request, textStatus, errorThrown) { 
         alert("Sorry, cannot find stock code " + code);
      }});
   }
   
   function displayStocks () {

      var vals = [];
      $('#stock-buttons').empty();

      for(var stock = 0; stock < stocks.length; stock++ ) {
         
         $('#stock-buttons').html($('#stock-buttons').html() + '<button id="' + stock + '" class="btn stock-button" style="color: ' + 
            colors[stock] + '">' + stocks[stock] + '&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-remove-sign"></span></button>');
            
         $('.stock-button').click(function () {
            var removed = stocks.splice(this.id, 1);
            $.ajax({url: window.location.origin + '/api/stock/' + removed[0], type: 'DELETE', success: function (result) { }});
            colors.push(colors.splice(this.id, 1));
            displayStocks();
         });
         
         var apiUrl = "https://www.quandl.com/api/v3/datasets/WIKI/" + stocks[stock] +
            ".json?start_date=2015-01-01&end_date=2016-01-01&order=asc&column_index=4&api_key=yxUrG7eH5x2MHTCQG_1M";

         $.ajax({url: apiUrl, async: false, success: function(results) {
            if(vals.length == 0) {
               for(var i = 0; i < results.dataset.data.length; i++) {
                  vals.push([new Date(results.dataset.data[i][0]), results.dataset.data[i][1]]);
               }
            } else {
               for(var i = 0; i < results.dataset.data.length; i++) {
                  var val = vals.filter(function (value) {
                     var date = new Date(results.dataset.data[i][0]);
                     return(value[0].getTime() == date.getTime());
                  });
                  if(val.length > 0) {
                     val[0].push(results.dataset.data[i][1]);
                  }
               }
               
               // fill any gaps in the sequence
               for(var i = 0; i < vals.length; i++) {
                  if(vals[i].length < stock + 2) {
                     vals[i].push(null);
                  }
               }
            }
         }, error: function (request, textStatus, errorThrown) { 
            for(var i = 0; i < vals.length; i++) {
               vals[i].push(null);
            }
         }});
      }
      
      $('input').focus();
      
      if(stocks.length > 0) {
         var data = new google.visualization.DataTable();
         data.addColumn('date', 'Date');
         for(var i = 0; i < stocks.length; i++ ) {
            data.addColumn('number', stocks[i]);
         }
         data.addRows(vals);
   
         var chart = new google.visualization.LineChart(document.getElementById('chart'));
         chart.draw(data, { 
            height: $(window).height() / 2,
            width: $(window).width(),
            legend: { position: 'none' }, 
            crosshair: { trigger: 'focus' }, 
            colors: colors, 
            interpolateNulls: true });
      } else {
         $('#chart').empty();
      }
   }
})();