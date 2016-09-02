var Utils = {

   /**********
     Constant Variables
    ********/

   ERROR_PAGE: 'login.html',
   SUCCESS_PAGE: 'news.html',
   COOKIE_EXPIRATION: 3,
   TOAST_TIME: 4000,


   /**********
     Cookie Utility Functions
    ********/

   /**
    * Function to set Cookie in browser.
    * @params :
    * 1. cname -> {String} Name of the cookie
    * 2. cvalue -> {String} Value for the cookie
    * 3. exdays -> {Number} No of days to expire cookie on.
    */
   setCookie: function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
   },

   /**
    * Function to get Cookie in browser.
    * @params :
    * 1. cname -> {String} Name of the cookie to get
    * @return -> Value of the string if found else empty string.
    */
   getCookie: function (cname) {
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
   },


   /**********
     User Utility Functions
    ********/

   /**
    * Function to get User Info.
    * * @return -> {Promise} 
    * Error = When no user is Present
    * Success = return {user_name, user_role}
    */
   getUser: function () {
      var self = this;
      return new Promise(function (fulfill, reject) {
         var user_cookies = { name: 'user_name', role: 'user_role' }
         var user_name = self.getCookie(user_cookies.name);
         var user_role = self.getCookie(user_cookies.role);
         if (user_name && user_role) {
            fulfill({ user_name: user_name, user_role: user_role });
         }
         reject();
      });
   },

   /**
    * Function to set User Info
    * @params :
    * 1. user_name -> {String} Name of the User
    * 2. user_role -> {String} Role of the User.
    */
   setUser: function (user_name, user_role) {
      this.setCookie('user_role', user_role, this['COOKIE_EXPIRATION']);
      this.setCookie('user_name', user_name, this['COOKIE_EXPIRATION']);
   },

   /**
    * Function to Clear User Info and logout him.
    */
   clearUser: function () {
      this.setCookie('user_role', '', -1);
      this.setCookie('user_name', '', -1);
      this.redirectPage(this['ERROR_PAGE']);
   },


   /**********
     Application Utility Functions
    ********/

   /**
    * Function to do Admin Control in Page ie. show links that only admin can see.
    * params user_role -> {String} Role of the User.
    */
   adminControl: function (user_role) {
      if (user_role === 'admin') {
         $(".only_admin").removeClass('hide');
      }
   },

   /**
    * Function to prompt user and get his response Yes/No
    * @param msg {string} Msg to be asked
    * @return userAnswer {boolean} true or false based on user response.
    */
   askUser: function (msg) {
      var userAnswer = confirm(msg);
      response(userAnswer);
   },

   /**
    * Function to get query variables in the url
    * @param varaible_name {String} Name of the variable to find in query string.
    * @return variablue_value or false
    */
   getUrlQueryVariables: function (variable_name) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
         var pair = vars[i].split("=");
         if (pair[0] == variable) { return pair[1]; }
      }
      return (false);
   },

   /**
    * Function to redirect user to a page.
    * @param :
    * 1. path -> {String} Location to send user to.
    */
   redirectPage: function (path) {
      window.location.href = path;
   },

   /**
    * Function to run upon starting a page. ie checking user authenticity.
    * params user_role -> {String} Role of the User.
    */
   runPageStartup: function(user_role) {
      this.adminControl(user_role);
      $('select').material_select();
   },

   /**
    * Searches a Array of object for a specified key value pair.
    * @param array {Array} Array of objects on which to search.
    * @param key {string} Key  to find
    * @param value {String} value to find
    * @return first javascript object found
    */
   searchArray: function (array, key, value) {
      return array.filter(function (val, i) {
         if (val[key] === value) {
            return val;
         }
      })[0];
   },

   /**
    * Function to Show error message.
    * @params :
    * 1. err_msg -> {String} Error message to be displayed.
    */
   showError: function (err_msg) {
      Materialize.toast(err_msg, this.toast_time, 'error');
   },

   /**
    * Function to Show Loader
    */
   showLoading: function() {
      $("#loader").openModal({
         dismissable: false
      });
   },
   /**
    * Function to hide Loader
    */
   hideLoading: function() {
      $("loader").closeModal();
   }
}