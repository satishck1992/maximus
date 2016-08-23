$('document').ready(function () {
   'use strict';

   isUserAuthenticated().then(function (user_info) {

      $('select').material_select();

      var user_name = user_info['user_name'];
      var user_role = user_info['user_role'];

      if (user_role === 'admin') {
         $('.only_admin').removeClass('hide');
      }

      loadNews();

      $('select').change(function (ev) {
         loadNews();
      });

      $('.news-table tbody').on("click", "td.actions a", function(ev) {
         var news_id= $(this).closest('tr').data('id');
         var self= this;
         if($(this).hasClass('publish_icon')) {
            publishNewsItem(news_id).then(function(success) {
               $(self).closest('tr').data('status', 'published');
               $(self).closest('tr').find('td.status').html('Published');
               $(self).remove();
            }, function(err) {
               
            });
         }
      });

      function loadNews() {
         var filterSportsType = $("#filter-sportsType").val();
         var filterNewsStatusType = $("#filter-newsStatusType").val();
         fetchNews(filterSportsType, filterNewsStatusType, user_name).then(function (news_list) {
            var html = buildHtml(news_list);
            $('.news-table tbody').html(html);
         }, function (err) { });
      }

      function buildHtml(news_list) {
         var html = '';
         $.each(news_list, function (i, item) {
            html += '<tr data-status="' + item.status + '" data-id="' + item.id + '">';
            html += '<td>' + (i + 1) + '</td>';
            html += '<td>' + item.sports_type + '</td>';
            html += '<td>' + item.headline + '</td>';
            html += '<td>' + item.date_time + '</td>';
            html += '<td class="status">' + item.status + '</td>';
            html+= '<td class="actions">';
            if(item.status=== 'draft') {
               html += '<a href="#" class="preview_icon"><i class="material-icons">visibility</i></a><a href="#" class="edit_icon"><i class="material-icons">create</i></a><a href="#" class="delete_icon"><i class="material-icons">delete_forever</i></a>';
            } else if(item.status=== 'unpublished') {
               if(user_role=== 'admin') {
                  html+= '<a href="#" class="publish_icon"><i class="material-icons">android</i></a>';
               }
               html += '<a href="#" class="preview_icon"><i class="material-icons">visibility</i></a><a href="#" class="edit_icon"><i class="material-icons">create</i></a><a href="#" class="delete_icon"><i class="material-icons">delete_forever</i></a>';
            } else {
               html += '<a href="#" class="preview_icon"><i class="material-icons">visibility</i></a>';
               if(user_role=== 'admin') {
                  html+= '<a href="#" class="delete_icon"><i class="material-icons">delete_forever</i></a>';
               }
            }
            html+= '</td>';
            html += '</tr>';
         });
         return html;
      }

   }, function (failure) {
      window.location.href = "index.html";
   });
});

function fetchNews(sportsTypeFilter, newsStatusFilter, user_name) {
   return new Promise(function (fulfill, reject) {
      var news_item = [
         { id: 1, headline: 'Atque', sports_type: 'Cricket', date_time: 11100001212, status: 'draft' },
         { id: 2, headline: 'Vitae Aut Temporibus Ut', sports_type: 'Football', date_time: 11100001212, status: 'published' },
         { id: 3, headline: 'Eius Facilis Quae Saepe', sports_type: 'Cricket', date_time: 11100001212, status: 'unpublished' },
         { id: 4, headline: 'Eos Temporibus A Reiciendis', sports_type: 'Football', date_time: 11100001224, status: 'unpublished' }
      ];
      fulfill(news_item);
   });
}

function publishNewsItem(news_Id) {
   return new Promise(function(fulfill, reject) {
      fulfill(true);
   });
}