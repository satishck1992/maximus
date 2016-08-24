(function (window) {
   'use strict';

   var CONST = { failure_page: "login.html", success_page: "news.html" }
   
   var userInfo = getUser();
   userInfo.then(redirectToPage(CONST.success_page));
   userInfo.catch(redirectToPage(CONST.failure_page));
})(window);