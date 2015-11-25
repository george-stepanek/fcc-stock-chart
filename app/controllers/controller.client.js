'use strict';

(function () {
   
   google.load("visualization", "1", {packages:["corechart"], "callback" : displayStocks});
   
   var colors = ['blue', 'red', 'green', 'purple'];
   var stocks = ['AAPL', 'MSFT', 'FB'];
   
   $('input').focus();
   $('input').keypress(function(e){
      if(e.keyCode == 13)
         $('.find-stock').click();
   });

   $('.find-stock').click(findStock);
   $(window).on('resize', displayStocks);
      
   function findStock () {
      
      stocks.push($('input').val());
      $('input').val('');
      $('input').blur();
      displayStocks();
   }
   
   function displayStocks () {

      var vals = [];
      //$('#stock-buttons').html("");
      
      for(var stock = 0; stock < stocks.length; stock++ ) {
         $('#stock-buttons').append('<button class="btn stock-button" style="color: ' + colors[stock] + '">' + stocks[stock] + 
            '&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-remove-sign"></span></button>');
         
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
               
               // fill in any gaps
               for(var i = 0; i < vals.length; i++) {
                  if(vals[i].length < stock + 2) {
                     vals[i].push(null);
                  }
               }
            }
         }});
      }
      
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      for(var i = 0; i < stocks.length; i++ ) {
         data.addColumn('number', stocks[i]);
      }
      data.addRows(vals);

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, { 
         height: $(window).height() / 2,
         width: $(window).width(),
         legend: { position: 'none' }, 
         crosshair: { trigger: 'focus' }, 
         colors: colors, 
         interpolateNulls: true });
   }

})();