/**
 * Function to set Cookie in browser.
 * @params :
 * 1. cname -> {String} Name of the cookie
 * 2. cvalue -> {String} Value for the cookie
 * 3. exdays -> {Number} No of days to expire cookie on.
 */
function setCookie(cname, cvalue, exdays) {
   var d = new Date();
   d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
   var expires = "expires=" + d.toUTCString();
   document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
 * Function to get Cookie in browser.
 * @params :
 * 1. cname -> {String} Name of the cookie to get
 * @return -> Value of the string if found else empty string.
 */
function getCookie(cname) {
   var name = cname + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}


/**
 * Function to check whether user is authenticated to access page.
 * @return -> {Promise} based on success or error
 */
function isUserAuthenticated() {
   return new Promise(function (fulfill, reject) {
      var user_cookies = {
         name: 'user_name',
         role: 'user_role'
      }

      var user_name = getCookie(user_cookies.name);
      var user_role = getCookie(user_cookies.role);

      if (user_name && user_role) {
         fulfill({ user_name: user_name, user_role: user_role });
      }
      reject();
   });
}