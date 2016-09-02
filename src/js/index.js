(function (window) {
   'use strict';

   Utils.getUser()
      .then(function () {
         Utils.redirectPage(Utils.SUCCESS_PAGE);
      })
      .catch(function () {
         Utils.redirectPage(Utils.ERROR_PAGE);
      });
})(window);