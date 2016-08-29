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

   function displayNews(user_name, user_role) {

      var sports_type = $("#filter-sportsType").val();
      var news_status = $("#filter-newsStatusType").val();
      getNews(sports_type, news_status, user_name)
         .then(function (news_list) {
            addToHTML(JSON.parse(news_list), user_role);
         })
         .catch(function (err) { showError(err); });
   }

   function addToHTML(list_of_news, user_role) {
      var html = '';
      $.each(list_of_news, function (i, news) {
         html += '<tr data-status="' + news.article_state + '" data-id="' + news.article_id + '">';
         html += singleRow(i + 1, news, user_role);
         html += '</tr>';
      });
      $('.news-table tbody').html(html);
   }

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
         html += '<td>' + news.publish_date + '</td>';
      } else {
         html += '<td>Not Published</td>';
      }
      html += '<td>' + news.article_state + '</td>';
      html += '<td class="actions">' + getActionsOfNews(news, user_role) + '</td>';
      return html;
   }

   function getActionsOfNews(news, user_role) {
      var html = '';
      var preview_btn = '<a href="/news_form.html?type=preview&news_id=' + news.article_id + '" target="_blank"><i class="material-icons">visibility</i></a>';
      var edit_btn = '<a href="/news_form.html?type=edit&news_id=' + news.article_id + '"><i class="material-icons">create</i></a>';
      var delete_btn = '<a href="#" class="delete_icon"><i class="material-icons">delete_forever</i></a>';
      var publish_btn = '<a href="#" class="publish_icon"><i class="material-icons">android</i></a>';
      if (news.article_state === 'draft') {
         html += preview_btn + edit_btn + delete_btn;
      } else if (news.article_state === 'UnPublished') {
         if (user_role === 'admin') { html += publish_btn; }
         html += preview_btn + edit_btn + delete_btn;
      } else {
         html += preview_btn;
         if (user_role === 'admin') { html += delete_btn; }
      }
      return html;
   }

   function deleteNewsEvt(ev) {
      ev.preventDefault();
      var newsRow = $(this).closest('tr');
      askUser('Are you sure, you want to delete.. Check if news is present in Carousel?', function (userAnswer) {
         if (userAnswer === true) {
            var newsId = newsRow.data('id');
            deleteNews(newsId)
               .then(function (success) {
                  newsRow.remove();
               })
               .catch(function (err) { showError(err); });
         }
      });
   }

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