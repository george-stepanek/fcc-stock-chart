'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);

      updateHtmlElement(userObject, displayName, 'displayName');

      if (profileId !== null) {
         updateHtmlElement(userObject, profileId, 'id');   
      }
      
      document.querySelector('#profile-photo').innerHTML = "<img src='" + userObject['photo'] + "'></img>";
   }));
})();
