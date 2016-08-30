/**
 * Function to get News from Server.
 * @params
 * 1. sports_type -> {String} Type of Sports of which news to be fetched [all/cricket/football]
 * 2. news_status -> {String} Type of News to be fetched [all/published/unpublished/draft]
 * 3. user_name -> {String} Name of the user who is fetching News data
 * @returns promise
 */
function getNews(sports_type, news_status, user_name) {
   var queryString = createQueryString();
   return new Promise(function (fulfill, reject) {
      $.ajax({
         url: 'http://54.169.217.88/fetch_articles?username=' + user_name + queryString,
         method: 'GET',
         success: function (response) {
            if (response.info === 'Success') {
               fulfill(response.articles);
            }
            reject(response.info);
         },
         error: function () {
            reject('Could not connect.');
         }
      });
   });

   function createQueryString() {
      var string = '';
      if (sports_type) { string += '&article_sport_type=' + sports_type; }
      if (news_status) { string += '&article_state=' + news_status; }
      return string;
   }
}

/**
 * Function to fetch Single News Item.
 * @param
 * 1. news_id -> Id of the News to be fetched.
 * @return promise
 */
function getSingleNews(news_id) {
   return new Promise(function (fulfill, reject) {
      $.ajax({
         url: 'http://54.169.217.88/get_article?article_id=' + news_id,
         method: 'GET',
         success: function (response) {
            if (response.info === 'Success') {
               fulfill(response.article);
            }
            reject('Some error occured in response.');
         },
         error: function (err) { reject(err); }
      });
   });
}


/**
 * Function to publish a News
 * @param
 * 1. news_id -> Id of the News to be published
 * @return promise
 */
function publishNews(news_id) {
   return new Promise(function (fulfill, reject) {
      $.ajax({
         url: 'http://54.169.217.88/publish_article',
         method: 'POST',
         data: {
            'article_id': news_id
         },
         success: function (response) {
            if (response.info === 'Success') {
               fulfill(response.article);
            }

            reject('Some error occured');
         },
         error: function (err) {
            reject(err);
         }
      });
   });
}

/**
 * Function to submit new News to the server.
 * @params
 * 1. form -> {HTML Element} Form whose value will be submitted.
 * 2. status -> {String} Status of the news setted. [draft/ unpublished]
 * @return promise
 */
function createNews() {
   return new Promise(function (fulfill, reject) {
      $.ajax({
         url: 'http://54.169.217.88/add_article',
         method: 'POST',
         data: new FormData($("#news-form")[0]),
         contentType: false,
         processData: false,
         success: function (response) {
            if (response.info === 'Success') {
               fulfill();
            }
            reject();
         },
         error: function (err) {
            console.log(err);
            reject();
         }
      });
   });
}

/**
 * Function to edit News item
 * @params
 * 1. news_id -> {string} Id of the news to be updated.
 * 2. form -> {HTML Element} Form containing new values.
 * @return promise
 */
function editNews(news_id, formData) {
   return new Promise(function (fulfill, reject) {
      formData.article_id = +news_id;
      console.log(formData);
      $.ajax({
         url: 'http://54.169.217.88/edit_article',
         method: 'POST',
         data: formData,
         success: function (response) {
            if (response.info === 'Success') {
               fulfill();
            }
            reject();
         },
         error: function () {
            reject();
         }
      });
   });
}

/**
 * Function to delete News Item
 * @params
 * 1. news_id -> {String} Id of the news to be deleted.
 * @return promise
 */
function deleteNews(news_id, force) {
   return new Promise(function (fulfill, reject) {
      $.ajax({
         url: 'http://54.169.217.88/delete_article',
         method: 'POST',
         data: {
            'article_id': news_id,
            'force_delete': +force
         },
         success: function (response) {
            if (response.info === 'Success') {
               fulfill(response.in_carousel);
            }
            reject('Some Error Occured.');
         },
         error: function (err) {
            reject('Couldnot connect to Server.');
         }
      })
   });
}

function fetchCarouselData() {
   return new Promise(function (fulfill, reject) {
      $.ajax({
         url: 'http://54.169.217.88/get_carousel_articles',
         method: 'GET',
         success: function (response) {
            if (response.info === 'Success') {
               fulfill(response.articles);
            }
            reject(response.info);
         },
         error: function (err) {
            reject(err);
         }
      })
   });
}