var UserAPIS = {
   serverUrl: 'http://54.169.217.88',
   /**
    * API for checking user login credentials.
    * @param username {String} Username
    * @param password {String} Password
    * @return {Promise} based on Successful API request and User Authentication.
    */
   loginAPI: function (username, password) {
      var self= this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/news_login',
            method: 'POST',
            data: {
               username: username,
               password: password
            },
            success: function (response) {
               if (response.status === 200) {
                  fulfill(response.user_role);
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err.responseJSON.info);
            }
         });
      });
   },
   /**
    * API for User Regisration
    * @param username {String} Username
    * @param password {String} Password
    * @param user_role {String} User Role[Admin/Author]
    * @return {Promise} based on Successful API request and User Regisration.
    */
   addUserAPI: function (username, password, user_role) {
      var self= this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/news_add_user',
            method: 'POST',
            data: {
               username: username,
               password: password,
               user_role: user_role
            },
            success: function (response) {
               if (response.status === 200) {
                  fulfill();
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err);
            }
         });
      });
   }
}