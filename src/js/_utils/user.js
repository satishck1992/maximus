/**
 * Function to get User Info.
 * * @return -> {Promise} 
 * Error = When no user is Present
 * Success = return {user_name, user_role}
 */
function getUser() {
   return new Promise(function (fulfill, reject) {
      var user_cookies = { name: 'user_name', role: 'user_role' }

      var user_name = getCookie(user_cookies.name);
      var user_role = getCookie(user_cookies.role);

      if (user_name && user_role) {
         fulfill({ user_name: user_name, user_role: user_role });
      }
      reject('No User Present');
   });
}

/**
 * Function to set User Info
 * @params :
 * 1. user_name -> {String} Name of the User
 * 2. user_role -> {String} Role of the User.
 */
function setUser(user_name, user_role) {
   setCookie('user_role', user_role, CONST['cookie-expirations']);
   setCookie('user_name', user_name, CONST['cookie-expirations']);
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
      $.ajax({
         url: 'http://54.169.217.88/news_login',
         method: 'POST',
         data: {
            username: user_name,
            password: password
         },
         success: function (response) {
            if (response.info === 'Success') {
               success({ user_role: response.user_role, user_name: user_name });
            }
            reject(response.info);
         },
         error: function () {
            reject('Could not connect to the Server..');
         }
      });
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
   return new Promise(function (fulfill, reject) {
      $.ajax({
         url: 'http://54.169.217.88/news_add_user',
         method: 'POST',
         data: {
            username: user_name,
            password: password,
            user_role: user_role
         },
         success: function (response) {
            if (response.info === 'Success') {
               fulfill();
            }
            reject(response.info);
         },
         error: function (err) {
            reject(err.responseJSON.info);
         }
      });
   });
}

/**
 * Function to logout user.
 */
function logOutUser() {
   setCookie('user_role', '', -1);
   setCookie('user_name', '', -1);
   window.location.href = "login.html";
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