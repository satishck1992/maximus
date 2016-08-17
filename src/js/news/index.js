$('document').ready(function () {
   'use strict';

   var news_state = {};
   var carousel_state = {};

   news_state.news_items = getNewsList();
   $('.news-table tbody').html(buildTableHtml(news_state.news_items));

   var el= document.getElementById('carousel-control');
   Sortable.create(el, { handle: '.name'});
});

function buildTableHtml(array) {
   var html = '';
   $.each(array, function (i, item) {
      html += '<tr class="' + item.status + '">';
      html += '<td>' + (i + 1) + '</td>';
      html += '<td>' + item.sports_type + '</td>';
      html += '<td>' + item.headline + '</td>';
      html += '<td>' + item.date_time + '</td>';
      html += '<td>' + item.status + '</td>';
      html += '<td><i class="material-icons">visibility</i><i class="material-icons">create</i><i class="material-icons">delete_forever</i></td>';
      html += '</tr>';
   });
   return html;
}

/**
 * Get List of news from Server
 */
function getNewsList() {
   return [
      {
         headline: 'Atque',
         sports_type: 'Cricket',
         date_time: 11100001212,
         status: 'draft'
      },
      {
         headline: 'Vitae Aut Temporibus Ut',
         sports_type: 'Football',
         date_time: 11100001212,
         status: 'published'
      },
      {
         headline: 'Eius Facilis Quae Saepe',
         sports_type: 'Cricket',
         date_time: 11100001212,
         status: 'accepted'
      },
      {
         headline: 'Eos Temporibus A Reiciendis',
         sports_type: 'Football',
         date_time: 11100001224,
         status: 'pending'
      }
   ];
}

/**
 * Send Post request to create a News.
 */
function createNews(news_data) {

}

/**
 * Send update request to edit a News.
 */
function editNews(news_id, news_data) {
   return;
}

/**
 * SEnd a delete request to delete a News.
 */
function deleteNews(news_id) {
   return;
}