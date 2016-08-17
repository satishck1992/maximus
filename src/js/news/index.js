$('document').ready(function () {
   'use strict';

   var news_state = {};
   var carousel_state = {};

   news_state.news_items = getNewsList();
   $('.news-table tbody').html(buildTableHtml(news_state.news_items));

   initializeKendoGrid();

   var el = document.getElementById('carousel-control');
   var x = Sortable.create(el, { handle: '.title' });
   $('.add_carousel_btn').click(function () {
      var thisItemID = $(this).closest('tr').data('id');
      var obj = news_state.news_items[thisItemID - 1];
      addItemToCarousel(obj);
   });
});

function buildTableHtml(array) {
   var html = '';
   $.each(array, function (i, item) {
      html += '<tr class="' + item.status + '" data-id="' + item.id + '">';
      html += '<td>' + (i + 1) + '</td>';
      html += '<td>' + item.sports_type + '</td>';
      html += '<td>' + item.headline + '</td>';
      html += '<td>' + item.date_time + '</td>';
      html += '<td>' + item.status + '</td>';
      html += '<td><i class="material-icons">visibility</i><i class="material-icons">create</i><i class="material-icons">delete_forever</i><a class="add_carousel_btn btn waves-effect">Add to carousel</a></td>';
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
         status: 'accepted'
      },
      {
         id: 4,
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

/**
 * Adds an element to the carousel
 */
function addItemToCarousel(obj) {
   var html = '';
   html += '<div class="box"><div class="title">' + obj.headline + '</div></div>';
   $('#carousel-control').append(html);
}

/**
 * Remove an element from the carousel
 */
function removeItemFromCarousel() {

}


/**
 * Handles Work related to Kendo Grid.
 */
function initializeKendoGrid() {
   var crudNewsBaseUrl = "localhost",
      dataSource = new kendo.data.DataSource({
         // transport: {
         //    read: {
         //       url: crudNewsBaseUrl + "/fetch_articles",
         //    },
         //    update: {
         //       url: crudNewsBaseUrl + "/edit_article"
         //    },
         //    destroy: {
         //       url: "",
         //    },
         //    create: {
         //       url: ""
         //    }
         // },
         // batch: true,
         data: getNewsList(),
         // pageSize: 20,
         schema: {
            model: {
               fields: {
                  headline: { editable: true, nullable: false },
                  // ArticleImageName: { editable: true, nullable: true },
                  // ArticleImageContent: { editable: true, nullable: true },
                  // ArticleContent: { editable: true, nullable: true },
                  // IceBreakerName: { editable: true, nullable: false },
                  // IceBreakerContent: { editable: true, nullable: false },
                  // PollQuestion: { editable: true, nullable: true },
                  // NotificationContent: { editable: true, nullable: true },
                  sports_type: { editable: true, nullable: false },
                  date_time: {editable: true, nullable: false },
                  status: { editable: false, nullable: false }
               }
            }
         }
      });
   $('.news-table table').kendoGrid({
      dataSource: dataSource,
      filterable: true,
      sortable: true,
      columns: [
         { field: "headline", title: "Headline" },
         { field: "sports_type", title: "Sports Type" },
         { field: "date_time", title: "Published Date", width: "120px" },
         { field: "status", width: "120px" },
         { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" },
         { command: { text: "Add to Carousel", click: addToCarousel }, title: " ", width: "180px" }
      ],
      editable: "popup"
   });

   function addToCarousel(e) {
      e.preventDefault();

      var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
      addItemToCarousel(dataItem);
   }
}