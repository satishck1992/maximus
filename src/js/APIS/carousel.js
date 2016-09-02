var CarouselAPI = {
   serverUrl: 'http://54.169.217.88',
   /**
    * API to Publish Carousel data
    * @param carouselData {Object} Object containing key values pair of article_id and priority.
    * @return {Promise} based on Successful API request and creating..
    */
   createCarousel: function (carouselData) {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/post_carousel_articles',
            method: 'POST',
            data: { articles: carouselData },
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
   },
   /**
    * API to Publish News Item
    * @param article_id {Integer} Id of the News Article to be Published.
    * @return {Promise} based on Successful API request and publishing.
    */
   getCarouselData: function () {
      var self = this;
      return new Promise(function (fulfill, reject) {
         $.ajax({
            url: self.serverUrl + '/get_carousel_articles',
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
      });
   }
}