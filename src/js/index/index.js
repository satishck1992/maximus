(function (window) {
   'use strict';

   var CONST= { "failure_page": "login.html", "success_page": "news.html" }
   /**
    * Check for User Authentication.
    * Redirect
   */   
   getUser().then(function (success) {
      window.location.href = CONST.success_page;
   }, function (failure) {
      window.location.href = CONST.failure_page;
   });
})(window);