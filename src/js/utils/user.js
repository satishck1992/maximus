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

/**
 * Function to authenticate User.
 */
function authenticateUser(user_name, password) {
   return new Promise(function (success, reject) {
      var HARD_CODED_USER = { user_name: 'admin', password: 'admin', user_role: 'admin' };
      if (user_name === HARD_CODED_USER.user_name && password === HARD_CODED_USER.password) {
         success({ success: true, user_role: 'admin' });
      } else {
         reject({ success: false });
      }
   });
}