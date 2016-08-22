$('document').ready(function () {

   var CONST = {
      'user-msg': 'User not Found',
      'success-page': 'news.html',
      'cookie-expirations': 3
   }

   // capture login form submit event.
   $('#login-form').submit(function (e) {
      e.preventDefault();
      var user_id = $("#user_name").val();
      var password = $("#password").val();
      var isAuth = authenticate(user_id, password);
      isAuth.then(function (user_info) {
         setCookie('user_role', user_info.user_role, CONST['cookie-expirations']);
         setCookie('user_name', user_id, CONST['cookie-expirations']);
         window.location.href = CONST['success-page'];
      }, function (error) {
         // delete cookie.
         setCookie('user_role', '', -1);
         setCookie('user_name', '', -1);
         $(".result").html(CONST['user-msg']);
      });
   });
});

/**
 * Function to authenticate User.
 */
function authenticate(user_name, password) {
   return new Promise(function (success, reject) {
      var HARD_CODED_USER = { user_name: 'admin', password: 'admin', user_role: 'admin' };
      if (user_name === HARD_CODED_USER.user_name && password === HARD_CODED_USER.password) {
         success({ success: true, user_role: 'admin' });
      } else {
         reject({ success: false });
      }
   });
}