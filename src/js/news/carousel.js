$('document').ready(function () {
   'use strict';

   getUser()
      .then(function (user_data) {
         var user_name = user_data.user_name;
         var user_role = user_data.user_role;

         adminControl(user_role);
         return fetchCarouselData(user_name);
      })
      .then(function (carousel_data) {
         var carousel= carousel_data.carousel;
         var news_list= carousel_data.published;
         // addCarouselHtml(carousel);
         addToHTML(news_list);
         $('.add-carousel-btn').on('click', function(e) {
            e.preventDefault();
            var tr= $(this).closest('tr');
            var id= tr.data('id');
            addToCarousel(id);
         });
         $('.save-carousel').click(function(e) {
            e.preventDefault();
            saveCarousel()
               .then
         });
      })
      .catch(function (err) {
         console.log(err);
      });

   function fetchPublishedNews(user_name) {
      return new Promise(function (fulfill, reject) {
         var news_status = 'Published';
         fetchCarouselData()
            .then(function(data) {
               fulfill(data);
            })
            .catch(function(err) {
               reject('Could not fetch Carousel data..');
            });
      });
   }

   function addCarouselHtml(list) {
      var html= '';
      $.each(list, function(i, item) {
         html+= '<li>List Item</li>';
      });
      $("#carousel-list").html(html);
      var list = document.getElementById("carousel-list");
      Sortable.create(list); // That's all.
   }

   function addToCarousel(id) {
      var html= '';
      html+= '<li>'+id+'</li>';
      $("#carousel-list").append(html);
      var list = document.getElementById("carousel-list");
      Sortable.create(list); // That's all.
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
            html += '<td>' + news.article_publish_date + '</td>';
         } else {
            html += '<td>Not Published</td>';
         }
         html += '<td>Published</td>';
         html += '<td class="actions"><a class="btn waves-effect add-carousel-btn" href="#">Add to Carousel</a></td>';
         return html;
      }
   }

});