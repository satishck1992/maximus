var NewsAPI = {
   serverUrl: 'http://54.169.217.88',
   /**
    * API to create News Item
    * @param formData {FormData} HTML formdata containing all article info
    * @return {Promise} based on Successful API request and Creating News List.
    */
   createNews: function (formData) {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/add_article',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
               if (response.status === 200) {
                  fulfill();
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err);
            }
         })
      });
   },
   /**
    * API for Fetch News Items
    * @param username {String} Username
    * @param sports_type {String} Sports Category of which news is to be fetched[Cricket/football]
    * @param news_status {String} Status of which news is to be fetched[Draft/Published/UnPublished]
    * @return {Promise} based on Successful API request and getting News List.
    */
   fetchNews: function (username, sports_type, news_status) {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/fetch_articles' + queryString(),
            method: 'GET',
            success: function (response) {
               if (response.status === 200) {
                  fulfill(response.articles);
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err);
            }
         });

         function queryString() {
            var str = '?username=' + username;
            if (sports_type) { str += '&article_sport_type=' + sports_type; }
            if (news_status) { str += '&article_state=' + news_status; }
            return str;
         }
      });
   },
   /**
    * API for Fetch Single News Item
    * @param article_id {Integer} Id of the Article to fetch
    * @return {Promise} based on Successful API request and getting News Item.
    */
   fetchSingleNews: function (article_id) {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/get_article?article_id=' + article_id,
            method: 'GET',
            success: function (response) {
               if (response.status === 200) {
                  fulfill(response.article);
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err);
            }
         });
      });
   },
   /**
    * API to update News Item
    * @param article_id {Integer} Id of the News Article to be updated.
    * @param formData {FormData} HTML formdata containing all article info
    * @return {Promise} based on Successful API request and edit.
    */
   editNews: function (article_id, formData) {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/edit_article',
            method: 'POST',
            data: formData,
            success: function (response) {
               if (response.status === 200) {
                  fulfill();
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err)
            }
         })
      });
   },
   /**
    * API to delete News Item
    * @param article_id {Integer} Id of the News Article to be deleted.
    * @param force {Boolean} Whether to force delete image or not.
    * @return {Promise} based on Successful API request.
    */
   deleteNews: function (article_id, force) {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/delete_article',
            method: 'POST',
            data: {
               'article_id': article_id,
               'force_delete': +force
            },
            success: function (response) {
               if (response.status) {
                  fulfill(response.in_carousel);
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err);
            }
         })
      });
   },
   /**
    * API to Publish News Item
    * @param article_id {Integer} Id of the News Article to be Published.
    * @return {Promise} based on Successful API request and publishing.
    */
   publishNews: function (article_id) {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/publish_article',
            method: 'POST',
            data: {
               'article_id': article_id
            },
            success: function (response) {
               if (response.status === 200) {
                  fulfill(response.article);
               }
               reject(response.info);
            },
            error: function (err) {
               reject(err);
            }
         })
      });
   }
}