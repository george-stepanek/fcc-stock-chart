'use strict';

(function () {
   
   var offset = 0;
   
   $('input').val('Auckland');
   
   $('input').keypress(function(e){
      if(e.keyCode == 13)
         $('.find-bars').click();
   });

   $('input').focus();
   
   function findBars () {
      var url = window.location.origin + '/api/bars/' + encodeURIComponent($('input').val()) + "?offset=" + offset;
      $.get(url, function (results) {
         var output = "";
         for(var i = 0; i < results.businesses.length; i++) {
            output = output + '<div class="row"><div class="col-sm-1">' +
               (results.businesses[i].image_url != undefined ? '<img src="' + results.businesses[i].image_url + '"></img>' : '') + 
               '</div><div class="col-sm-2"><a target="_blank" href="' +
               results.businesses[i].url + '"><h4>' +
               results.businesses[i].name + '</h4></a></div><div class="col-sm-7"><i>' + 
               (results.businesses[i].snippet_text != undefined ? '"' + results.businesses[i].snippet_text + '"': '') + 
               '</i></div><div class="col-sm-1"><button class="btn is-going" id="' +
               results.businesses[i].id + '">0 going</button></div><div class="col-sm-1" style="width:70px; text-align:right;"><span>(' + 
               (offset + i + 1) + ')</span></div></div>';
         }
         output = output + '<div class="row"><div class="col-sm-1"><button class="btn find-prev"' + (offset <= 0 ? ' disabled' : '') + '>' +
            '<span class="glyphicon glyphicon-triangle-left"></span> Prev</button></div><div class="col-sm-9"></div>' +
            '<div class="col-sm-1"><button class="btn find-next"' + (offset >= results.total - 10 ? 'disabled' : '') +
            '>Next <span class="glyphicon glyphicon-triangle-right">' +
            '</span></button></div></div>';
            
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
            alert(this.id);
         });
      });
   }
   
   $('.find-bars').click( function () {
      offset = 0;
      findBars();
   });

   $("document").ready($.get(window.location.origin + '/api/:id', function (user) {
      $('#profile-photo').html("<img src='" + user.photo + "'></img>");
      $('#login').hide();
      $('#logout').show();
      
      if (window.location.hash && window.location.hash === "#_=_") {
         if (window.history && window.history.pushState) {
            window.history.pushState("", document.title, window.location.pathname);
         } else {
            location.hash = "";
         }
      }
   }));
})();

/*{ is_claimed: true,
       rating: 4.5,
       mobile_url: 'http://m.yelp.com/biz/little-easy-auckland',
       rating_img_url: 'http://s3-media2.fl.yelpcdn.com/assets/2/www/img/99493c12711e/ico/stars/v1/stars_4_half.png',
       review_count: 13,
       name: 'Little Easy',
       rating_img_url_small: 'http://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png',
       url: 'http://www.yelp.com/biz/little-easy-auckland',
       categories: [Object],
       phone: '+6493600098',
       snippet_text: 'Let\'s be honest, Auckland is an overpriced, pretentious city, with a LOT of restaurants pretending to be cool. This place however is the real deal. Fabulous...',
       image_url: 'http://s3-media3.fl.yelpcdn.com/bphoto/zN0gzHBv67SsrIqaU3rlrA/ms.jpg',
       snippet_image_url: 'http://s3-media4.fl.yelpcdn.com/assets/srv0/yelp_styleguide/cc4afe21892e/assets/img/default_avatars/user_medium_square.png',
       display_phone: '+64 9 360 0098',
       rating_img_url_large: 'http://s3-media4.fl.yelpcdn.com/assets/2/www/img/9f83790ff7f6/ico/stars/v1/stars_large_4_half.png',
       id: 'little-easy-auckland',
       is_closed: false,
       location: [Object] }, */