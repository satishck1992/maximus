$('document').ready(function () {
   'use strict';

   isUserAuthenticated().then(function (user_info) {

      $('select').material_select();

      var user_name = user_info['user_name'];
      var user_role = user_info['user_role'];

      if (user_role === 'admin') {
         $('.only_admin').removeClass('hide');
      }

   }, function (failure) {
      window.location.href = "index.html";
   });
});