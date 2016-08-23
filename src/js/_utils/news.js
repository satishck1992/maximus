/**
 * Function to get News from Server.
 * @params
 * 1. sports_type -> {String} Type of Sports of which news to be fetched [all/cricket/football]
 * 2. news_status -> {String} Type of News to be fetched [all/published/unpublished/draft]
 * 3. user_name -> {String} Name of the user who is fetching News data
 * @returns promise
 */
function getNews(sports_type, news_status, user_name) {
   return new Promise(function (fulfill, reject) {
      fulfill([
         { id: 1, headline: 'Atque', sports_type: 'Cricket', date_time: 11100001212, status: 'draft' },
         { id: 2, headline: 'Vitae Aut Temporibus Ut', sports_type: 'Football', date_time: 11100001212, status: 'published' },
         { id: 3, headline: 'Eius Facilis Quae Saepe', sports_type: 'Cricket', date_time: 11100001212, status: 'unpublished' },
         { id: 4, headline: 'Eos Temporibus A Reiciendis', sports_type: 'Football', date_time: 11100001224, status: 'unpublished' }
      ]);
   });
}

/**
 * Function to fetch Single News Item.
 * @param
 * 1. news_id -> Id of the News to be fetched.
 * @return promise
 */
function getSingleNews(news_id) {
   return new Promise(function (fulfill, reject) {
      fulfill({ id: 1, headline: 'Atque', sports_type: 'Cricket', date_time: 11100001212, status: 'draft' });
   });
}


/**
 * Function to publish a News
 * @param
 * 1. news_id -> Id of the News to be published
 * @return promise
 */
function publishSingleNews(news_id) {
   return new Promise(function(fulfill, reject) {
      fulfill({ id: 2, headline: 'Vitae Aut Temporibus Ut', sports_type: 'Football', date_time: 11100001212, status: 'published' });
   });
}

/**
 * Function to submit new News to the server.
 * @params
 * 1. form -> {HTML Element} Form whose value will be submitted.
 * 2. status -> {String} Status of the news setted. [draft/ unpublished]
 * @return promise
 */
function createNews(form, status) {
   return new Promise(function (fulfill, reject) {
      fulfill({});
   });
}

/**
 * Function to edit News item
 * @params
 * 1. news_id -> {string} Id of the news to be updated.
 * 2. form -> {HTML Element} Form containing new values.
 * @return promise
 */
function editNews(news_id, form, status) {
   return new Promise(function (fulfill, reject) {
      fulfill({});
   });
}

/**
 * Function to delete News Item
 * @params
 * 1. news_id -> {String} Id of the news to be deleted.
 * @return promise
 */
function deleteNews(news_id) {
   return new Promise(function (fulfill, reject) {
      fulfill({});
   });
}