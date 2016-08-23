$('document').ready(function () {
   'use strict';

   var CONST = {
      "error_page": "login.html",
   }

   isUserAuthenticated().then(function (user_info) {
      var user_name = user_info.user_name;
      var user_role = user_info.user_role;

      fetchNews();

      $('.news-table tbody').on("click", "td.actions a", function (ev) { });
      $('select').change(function (ev) {
         fetchNews();
      });

      function fetchNews() {
         var sports_type = $("#filter-sportsType").val();
         var news_status = $("#filter-newsStatusType").val();
         getNews(sports_type, news_status, user_name).then(function (news_list) {
            addNewsToHTMLTable(news_list);
         });
      }


      function addNewsToHTMLTable(list_of_news) {
         var html = '';
         $.each(list_of_news, function (i, news) {
            html += '<tr data-status="' + news.status + '" data-id="' + news.id + '">';
            html += '<td>' + (i + 1) + '</td>';
            html += '<td>' + news.sports_type + '</td>';
            html += '<td>' + news.headline + '</td>';
            html += '<td>' + news.date_time + '</td>';
            html += '<td>' + news.status + '</td>';
            html += '<td>' + getActionsOfNews(news, user_role) + '</td>';
            html += '</tr>';
         });
         $('.news-table tbody').html(html);

         function getActionsOfNews(news, user_role) {
            var html = '';
            var preview_btn = '<a href="/news_form.html?type=preview&news_id=' + news.id + '"><i class="material-icons">visibility</i></a>';
            var edit_btn = '<a href="/news_form.html?type=edit&news_id=' + news.id + '"><i class="material-icons">create</i></a>';
            var delete_btn = '<a href="#" class="delete_icon"><i class="material-icons">delete_forever</i></a>';
            var publish_btn = '<a href="#" class="publish_icon"><i class="material-icons">android</i></a>';
            if (news.status === 'draft') {
               html += preview_btn + edit_btn + delete_btn;
            } else if (news.status === 'unpublished') {
               if (user_role === 'admin') {
                  html += publish_btn;
               }
               html += preview_btn + edit_btn + delete_btn;
            } else {
               html += preview_btn;
               if (user_role === 'admin') {
                  html += delete_btn;
               }
            }
            return html;
         }
      }
   }, function (failure) {
      window.location.href = CONST.error_page;
   });
});