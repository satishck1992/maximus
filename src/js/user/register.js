$('document').ready(function () {
   'use strict';

   isUserAuthenticated().then(function (user_info) {
      var user_role = user_info.user_role;
      
      $('select').material_select();
      if(user_role=== 'admin') {
         $(".only_admin").removeClass('hide');
      }
      $('.logout-btn').click(function(e) {
         e.preventDefault();
         logOutUser();
      });

      if (user_role === 'admin') {
         $('#registration-form').submit(function (e) {
            e.preventDefault();
            var user_id = $("#user_name").val();
            var password = $("#password").val();
            var user_role= $("#user_role").val();
            var addUser = addNewUser(user_id, password, user_role);
            addUser.then(function () {
               $('#registration-form')[0].reset();
               Materialize.toast("successfully added user", 4000);
            }, function (error) {
               Materialize.toast(error, 4000, 'error');
            });
         });
      }
   }, function (fail) {
      window.location.href = "login.html";
   });
});