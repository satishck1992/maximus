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
 * @param
 * 1. user_name -> {String} User Name
 * 2. password -> {String} Password
 * @return -> {Promise} based on success and failure. 
 */
function authenticateUser(user_name, password) {
   return new Promise(function (success, reject) {
      var HARD_CODED_USER = { user_name: 'admin', password: 'admin', user_role: 'admin' };
      if (user_name === HARD_CODED_USER.user_name && password === HARD_CODED_USER.password) {
         success({ success: true, user_role: 'admin', user_name: 'admin' });
      } else {
         reject({ success: false });
      }
   });
}

/**
 * Function to add New User
 * @param
 * 1. user_name -> {String} User Name
 * 2. password -> {String} Password
 * 3. user_role -> {String} User Role
 * @return -> {Promise} based on successful or fail addition
 */
function addNewUser(user_name, password, user_role) {
   return new Promise(function(fulfill, reject) {
      fulfill(true);
   });
}