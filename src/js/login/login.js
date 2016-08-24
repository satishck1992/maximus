$('document').ready(function () {
   'use strict';

   getUser()
      // user is present, redirect to admin page.
      .then(function (success) {
         redirectToPage(CONST.success_page);
      })
      // no user is present, initialize login form
      .catch(function (fail) {
         bindLoginEvt()
      });


   function bindLoginEvt() {
      $("#login-form").submit(function (ev) {
         ev.preventDefault();
         var user_id = $("#user_name").val();
         var password = $("#password").val();

         authenticateUser(user_id, password)
            .then(function (user_data) {
               setUser(user_data);
               redirectToPage(CONST.success_page);
            })
            .catch(function (err) {
               showError(err);
            });
      });
   }
});