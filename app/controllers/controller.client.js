'use strict';

(function () {
   
   $('input').keypress(function(e){
      if(e.keyCode == 13)
         $('.find-bars').click();
   });
   $('input').focus();
         
   var userid = null;
   var goingTo = '';
   var offset = 0;
   
   function apiUrl () {
      return window.location.origin + '/api/bars/' + encodeURIComponent($('input').val()) + "?offset=" + offset;
   }

   function displayBars (results) {
      var output = "";
      for(var i = 0; i < results.businesses.length; i++) {
         output = output + '<div class="row">' +
            '<div class="col-sm-1">' + (results.businesses[i].image_url != undefined ? 
               '<img src="' + results.businesses[i].image_url + '"></img>' : '') + '</div>' + 
            '<div class="col-sm-2"><a target="_blank" href="' + results.businesses[i].url + 
               '"><h4>' + results.businesses[i].name + '</h4></a></div>' + 
            '<div class="col-sm-7"><i>' + (results.businesses[i].snippet_text != undefined ? 
               '"' + results.businesses[i].snippet_text + '"': '') + '</i></div>' +
            '<div class="col-sm-1"><button class="btn is-going' + (results.businesses[i].id == goingTo ? ' btn-primary' : '') +
               '" ' + (userid == null ? "disabled" : "") + ' id="' + results.businesses[i].id + '">' + 
                  results.businesses[i].going + ' going</button></div>' +
            '<div class="col-sm-1" style="width:70px; text-align:right;"><span>(' + (offset + i + 1) + ')</span></div></div>';
      }
      output = output + '<div class="row">' +
         '<div class="col-sm-1"><button class="btn find-prev"' + (offset <= 0 ? ' disabled' : '') + '>' +
            '<span class="glyphicon glyphicon-triangle-left"></span> Prev</button></div>' +
         '<div class="col-sm-9"></div>' +
         '<div class="col-sm-1"><button class="btn find-next"' + (offset >= results.total - 10 ? 'disabled' : '') +
            '>Next <span class="glyphicon glyphicon-triangle-right"></span></button></div></div>';
         
      $('#results').html(output);
      
      $('.find-prev').click( function () {
         offset -= 10;
         findBars();
      });
      
      $('.find-next').click( function () {
         offset += 10;
         findBars();
      });
      
      $('.is-going').click( function () {
         if($(this).hasClass('btn-primary')) {
            goingTo = '';
            $.post(apiUrl() + "&goingto=", function (results) { findBars(); });       
         } else {
            goingTo = this.id;
            $.post(apiUrl() + "&goingto=" + this.id, function (results) { findBars(); });
         }
      });
   }

   function findBars () {
      $.cookie("city", $('input').val());
      $.cookie("offset", offset);
      $.get(apiUrl(), displayBars);
   }
   
   $('.find-bars').click( function () {
      offset = 0;
      findBars();
   });

   $("document").ready($.get(window.location.origin + '/api/:id', function (user) {
      $('#profile-photo').html("<img src='" + user.photo + "'></img>");
      $('#login').hide();
      $('#logout').show();
      userid = user.id;
      goingTo = user.goingTo;
      
      // recommended fix for facebook authentication bug
      if (window.location.hash && window.location.hash === "#_=_") {
         if (window.history && window.history.pushState) {
            window.history.pushState("", document.title, window.location.pathname);
         } else {
            location.hash = "";
         }
      }
      
      if($.cookie("city")) {
         $('input').val($.cookie("city"));
         offset = parseInt($.cookie("offset"));
         findBars();
         $('input').blur();
      }
   }));
})();