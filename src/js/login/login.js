$('document').ready(function () {
   'use strict';

   getUser()
      .then(function (success) {
         redirectToPage(CONST.success_page);
      })
      .catch(function (fail) {
         // if no user is present, then only login form make sense.
         bindLoginEvt()
      });


   function bindLoginEvt() {
      $("#login-form").submit(function (ev) {
         ev.preventDefault();
         var user_id = $("#user_name").val();
         var password = $("#password").val();

         authenticateUser(user_id, password)
            .then(function (user_data) {
               setUser(user_data.user_name, user_data.user_role);
               redirectToPage(CONST.success_page);
            })
            .catch(function (err) {
               showError(err);
            });
      });
   }

});