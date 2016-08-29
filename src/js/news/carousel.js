$('document').ready(function () {
   'use strict';

   getUser()
      .then(function (user_data) {
         var user_name = user_data.user_name;
         var user_role = user_data.user_role;

         adminControl(user_role);

         return fetchPublishedNews(user_name);
      })
      .then(function (published_news) {
         addToHTML(JSON.parse(published_news));
      
         var list = document.getElementById("carousel-list");
         Sortable.create(list); // That's all.         
      })
      .catch(function (err) {
         console.log(err);
      });

   function fetchPublishedNews(user_name) {
      return new Promise(function (fulfill, reject) {
         var news_status = 'Published';
         getNews('', news_status, user_name)
            .then(function (news_list) {
               fulfill(news_list);
            })
            .catch(function (err) {
               reject('Could not fetch News.');
            });
      });
   }

   /**
    * Function to add List of news to be table.
    */
   function addToHTML(list_of_news) {
      var html = '';
      $.each(list_of_news, function (i, news) {
         html += '<tr data-status="' + news.article_state + '" data-id="' + news.article_id + '">';
         html += singleRow(i + 1, news);
         html += '</tr>';
      });
      $('.news-table tbody').html(html);

      /**
       * Fn to make html for a single row.
      */
      function singleRow(i, news) {
         var sports_key = {
            'c': 'Cricket',
            'f': 'Football'
         }
         var html = '';
         html += '<td>' + i + '</td>';
         html += '<td>' + sports_key[news.article_sport_type] + '</td>';
         html += '<td>' + news.article_headline + '</td>';
         if (news.article_state === 'Published') {
            html += '<td>' + news.publish_date + '</td>';
         } else {
            html += '<td>Not Published</td>';
         }
         html += '<td>' + news.article_state + '</td>';
         html += '<td class="actions">Add to Carousel</td>';
         return html;
      }
   }

});