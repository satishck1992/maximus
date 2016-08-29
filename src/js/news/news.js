$('document').ready(function () {
   'use strict';

   getUser()
      .then(function (user_data) {
         var user_name = user_data.user_name;
         var user_role = user_data.user_role;

         adminControl(user_role);
         $('select').material_select();

         displayNews(user_name, user_role);
         $('select').change(function (ev) { displayNews(user_name, user_role); });
         $('.news-table tbody').on("click", "td.actions a.delete_icon", deleteNewsEvt);
         $('.news-table tbody').on("click", "td.actions a.publish_icon", { user_role: user_role }, publishNewsEvt);
      })
      .catch(function () { redirectToPage(CONST.login_page); });

   /**
    * Fn to display News in News page.
    * @params:
    * user_name -> {String} User name for which news to be fetched.
    * user_role -> {string} Role of the user logged in.
    */
   function displayNews(user_name, user_role) {
      var sports_type = $("#filter-sportsType").val();
      var news_status = $("#filter-newsStatusType").val();
      
      getNews(sports_type, news_status, user_name)
         .then(function (news_list) {
            addToHTML(JSON.parse(news_list), user_role);
         })
         .catch(function (err) { showError(err); });
      
      /**
       * Function to add List of news to be table.
       */
      function addToHTML(list_of_news, user_role) {
         var html = '';
         $.each(list_of_news, function (i, news) {
            html += '<tr data-status="' + news.article_state + '" data-id="' + news.article_id + '">';
            html += singleRow(i + 1, news, user_role);
            html += '</tr>';
         });
         $('.news-table tbody').html(html);
      }
      
      /**
       * Fn to make html for a single row.
       */
      function singleRow(i, news, user_role) {
         var sports_key= {
            'c': 'Cricket',
            'f': 'Football'
         }
         var html = '';
         html += '<td>' + i + '</td>';
         html += '<td>' + sports_key[news.article_sport_type] + '</td>';
         html += '<td>' + news.article_headline + '</td>';
         if(news.article_state === 'Published') {
            html += '<td>' + news.article_publish_date + '</td>';
         } else {
            html += '<td>Not Published</td>';
         }
         html += '<td>' + news.article_state + '</td>';
         html += '<td class="actions">' + getActionsOfNews(news, user_role) + '</td>';
         return html;
      }

      /**
       * Function to create Actions button HTML
       */
      function getActionsOfNews(news, user_role) {
         var html = '';
         var preview_btn = '<a href="/news_form.html?type=preview&news_id=' + news.article_id + '" target="_blank" class="preview_icon"><i class="material-icons">visibility</i></a>';
         var edit_btn = '<a href="/news_form.html?type=edit&news_id=' + news.article_id + '" class="edit_icon"><i class="material-icons">create</i></a>';
         var delete_btn = '<a href="#" class="delete_icon"><i class="material-icons">delete_forever</i></a>';
         var publish_btn = '<a href="#" class="publish_icon"><i class="material-icons">send</i></a>';
         if (news.article_state === 'Draft') {
            html += preview_btn + delete_btn + edit_btn;
         } else if (news.article_state === 'UnPublished') {
            html += preview_btn + delete_btn + edit_btn;
            if (user_role === 'admin') { html += publish_btn; }
         } else {
            html += preview_btn;
            if (user_role === 'admin') { html += delete_btn; }
         }
         return html;
      }
   }

   /**
    * Event when delete action item is clicked.
    */
   function deleteNewsEvt(ev) {
      ev.preventDefault();
      var newsRow = $(this).closest('tr');
      askUser('Are you sure, you want to delete..', function (userAnswer) {
         if (userAnswer === true) {
            var newsId = newsRow.data('id');
            deleteNews(newsId, false)
               .then(function (in_carousel) {
                  if(in_carousel=== false) {
                     newsRow.remove();
                  } else {
                     askUser('news exist in carousel? It wil be deleted from carousel as well..', function(userAnswer) {
                        if(userAnswer=== true) {
                           deleteNews(nwesId, true)
                              .then(function(success) {
                                 newsRow.remove();
                              })
                        }
                     });
                  }
               })
               .catch(function (err) { showError(err); });
         }
      });
   }

   /**
    * Event when publish new item is clicked.
    */
   function publishNewsEvt(ev) {
      var user_role = ev.data.user_role;
      var newsRow = $(this).closest('tr');
      var newsId = newsRow.data('id');
      publishNews(newsId)
         .then(function (updated_news_obj) {
            var newsSrNo = Number(newsRow.find('td:first-child').html());
            newsRow.html(singleRow(newsSrNo, updated_news_obj, user_role));
            newsRow.data('status', 'Published');
         })
         .catch(function (err) { showError(err); });
   }
});