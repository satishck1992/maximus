(function (window) {
   'use strict';

   getUser()
      // user is present, redirect to admin page.
      .then(function (success) {
         redirectToPage(CONST.success_page);
      })
      // no user is present, initialize login form
      .catch(function (fail) {
         redirectToPage(CONST.login_page);
      });
})(window);