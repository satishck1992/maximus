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
            html += '<tr class="' + item.status + '" data-id="' + item.id + '">';
            html += '<td>' + (i + 1) + '</td>';
            html += '<td>' + item.sports_type + '</td>';
            html += '<td>' + item.headline + '</td>';
            html += '<td>' + item.date_time + '</td>';
            html += '<td>' + item.status + '</td>';
            html+= '<td>';
            if(item.status=== 'draft') {
               html += '<i class="material-icons preview_icon">visibility</i><i class="material-icons edit_icon">create</i><i class="material-icons delete_icon">delete_forever</i>';
            } else if(item.status=== 'unpublished') {
               if(user_role=== 'admin') {
                  html+= '<i class="material-icons publish_icon">android</i>';
               }
               html += '<i class="material-icons preview_icon">visibility</i><i class="material-icons edit_icon">create</i><i class="material-icons delete_icon">delete_forever</i>';
            } else {
               html += '<i class="material-icons preview_icon">visibility</i>';
               if(user_role=== 'admin') {
                  html+= '<i class="material-icons delete_icon">delete_forever</i>';
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
         {
            id: 1,
            headline: 'Atque',
            sports_type: 'Cricket',
            date_time: 11100001212,
            status: 'draft'
         },
         {
            id: 2,
            headline: 'Vitae Aut Temporibus Ut',
            sports_type: 'Football',
            date_time: 11100001212,
            status: 'published'
         },
         {
            id: 3,
            headline: 'Eius Facilis Quae Saepe',
            sports_type: 'Cricket',
            date_time: 11100001212,
            status: 'unpublished'
         },
         {
            id: 4,
            headline: 'Eos Temporibus A Reiciendis',
            sports_type: 'Football',
            date_time: 11100001224,
            status: 'unpublished'
         }
      ];
      fulfill(news_item);
   });
}