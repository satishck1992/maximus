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