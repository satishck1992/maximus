$('document').ready(function () {

   var CONST = {
      "success_page": "news.html",
      'user-msg': 'User not Found',
      'cookie-expirations': 3,
      'toast-time': 4000
   }

   isUserAuthenticated().then(function (success) {
      window.location.href = CONST.success_page;
   }, function (failure) {
      showForm();
      bindSubmitEvent();
   });

   function showForm() {
      $('.login-card').removeClass('hide');
   }

   function bindSubmitEvent() {
      $('#login-form').submit(function (e) {
         e.preventDefault();
         var user_id = $("#user_name").val();
         var password = $("#password").val();
         var isAuth = authenticateUser(user_id, password);
         isAuth.then(function (user_info) {
            setCookie('user_role', user_info.user_role, CONST['cookie-expirations']);
            setCookie('user_name', user_id, CONST['cookie-expirations']);
            window.location.href = CONST['success_page'];
         }, function (error) {
            Materialize.toast(CONST['user-msg'], CONST['toast-time'], 'error');
         });
      });
   }
});