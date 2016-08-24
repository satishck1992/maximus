(function (window) {
   'use strict';

   getUser()
      .then(function (success) {
         redirectToPage(CONST.success_page);
      })
      .catch(function (fail) {
         redirectToPage(CONST.login_page);
      });
})(window);