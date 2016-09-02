$('document').ready(function () {
   'use strict';

   Utils.getUser()
      .then(function () {
         Utils.redirectPage(Utils.SUCCESS_PAGE);
      })
      .catch(function () {
         $('#login-form').submit(loginUser);
      });


   function loginUser(ev) {
      ev.preventDefault();
      var user_id = $("#user_name").val();
      var password = $("#password").val();

      authenticateUser(user_id, password);
   }

   function authenticateUser(user_id, password) {
      UserAPIS.loginAPI(user_id, password)
         .then(function (user_role) {
            Utils.setUser(user_id, user_role);
            Utils.redirectPage(Utils.SUCCESS_PAGE);
         })
         .catch(function (err) {
            Utils.showError(err);
         });
   }
});