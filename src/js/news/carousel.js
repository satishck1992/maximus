$('document').ready(function () {
   'use strict';

   getUser()
      .then(function (user_data) {

         Utils.adminControl(user_data.user_role);
         return NewsAPI.fetchCarousels();
      })
      .then(function (carousel_data) {
         var carousel = carousel_data.carousel;
         var news_list = carousel_data.published;

         var carouselData = makeCarouselJson(carousel, news_list);
         var tableData = makeTableJson(carousel, news_list);
         loadCarousel(carouselData);
         loadTable(tableData);
         initializeSortableList();

         $('.save-carousel').click(function(e) {
            e.preventDefault();
            var carouselJson= getCarouselJson();
            NewsAPI.postCarousel(carouselJson)
               .then(function() {
                  Materialize.toast('done');
               })
               .catch(function(err) {
                  Utils.showError(err);
               });
         });

         $('.add-carousel-btn').on('click', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr'),
               id = tr.data('id'),
               obj = createCarouselObject(id, news_list),
               html = htmlCarousel(obj);
            $("#carousel-list").append(html);
            updatePriorityNumber();
            tr.find('.add-carousel-btn').addClass('hide');
            tr.find('.remove-carousel-btn').removeClass('hide');
         });

         $('.remove-carousel-btn').on('click', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr'),
               id = tr.data('id');
            $("#carousel-list").find('.carousel-box[data-id="' + id + '"]').remove();
            updatePriorityNumber();
            tr.find('.add-carousel-btn').removeClass('hide');
            tr.find('.remove-carousel-btn').addClass('hide');
         });
      })
      .catch(function (err) {
         Utils.showError(err);
      });

   /**
    * update the carousel response to include News Image, headline etc in JSON
    */
   function makeCarouselJson(carousels, news_list) {
      var sortedList = carousels.sort(function (a, b) {
         return a.priority - b.priority;
      });
      var carouselJsonList = sortedList.map(function (obj, i) {
         var op = createCarouselObject(obj.article_id, news_list);
         op.position = obj.priority+1;
         return op;
      });
      return carouselJsonList;
   }

   /**
    * Function to create Object for Carousel to be used for creating HTML
    */
   function createCarouselObject(article_id, news_list) {
      var op = {};
      var news_obj = Utils.searchList(news_list, 'article_id', article_id);
      op.article_id = news_obj.article_id;
      op.article_image = news_obj.article_image;
      op.article_headline = news_obj.article_headline;
      op.article_sport_type = news_obj.article_sport_type;
      op.position = 0;
      return op;
   }

   /**
    * Function to create and display Carousels HTML.
    */
   function loadCarousel(carousel_data) {
      var html = htmlCarousels(carousel_data);
      $("#carousel-list").html(html);
   }

   /**
    * Function to get HTML for a carousel list.
   * Ex: [{headline, img, id, sports_type}]
    */
   function htmlCarousels(carousel_list) {
      var html = '';
      $.each(carousel_list, function (i, carousel_item) {
         html += htmlCarousel(carousel_item);
      });
      return html;
   }

   /**
    * Function to get HTML for a single carousel item.
    * Ex: {headline, img, id, sports_type, position}
    */
   function htmlCarousel(carousel) {
      var html = '';
      html += '<div class="carousel-box" data-id="' + carousel.article_id + '">';
      html += '<div class="image" style="background-image: url(' + carousel.article_image + '); background-size: cover;">';
      html += '<div class="banner">';
      html += '<span class="number">' + carousel.position + '</span>';
      html += '<i class="material-icons remove-icon">clear</i>'
      html += '</div>';
      html += '</div>';
      html += '<div class="carousel-headline">';
      html += carousel.article_headline;
      html += '</div>';
      html += '</div>';
      return html;
   }

   function makeTableJson(carousels, news_list) {
      var op = news_list.map(function (news, i) {
         news.inCarousel = false;
         var isNewsInCarousel = Utils.searchList(carousels, 'article_id', news.article_id);
         if (isNewsInCarousel) {
            news.inCarousel = true;
         }
         return news;
      });
      return op;
   }

   /**
   * Function to create and display Table HTML
   */
   function loadTable(list_of_news) {
      var html = htmlTableRows(list_of_news);
      $('.news-table tbody').html(html);
   }

   /**
    * Function to create HTML for Multiple Rows
    */
   function htmlTableRows(news_list) {
      var html = '';
      $.each(news_list, function (i, news) {
         html += '<tr data-id="' + news.article_id + '">';
         html += htmlTableRow(i + 1, news);
         html += '</tr>';
      });
      return html;
   }
   /**
    * Function to create HTML for a single row
   */
   function htmlTableRow(i, news) {
      var sports_key = {
         'c': 'Cricket',
         'f': 'Football'
      }
      var html = '';
      html += '<td>' + i + '</td>';
      html += '<td>' + sports_key[news.article_sport_type] + '</td>';
      html += '<td>' + news.article_headline + '</td>';
      html += '<td>' + news.article_publish_date + '</td>';
      html += '<td class="actions">';
      if (news.inCarousel) {
         html += '<a class="btn-flat waves-effect add-carousel-btn hide" href="#">Add to Carousel</a><a class="btn-flat waves-effect remove-carousel-btn" href="#">Remove from Carousel</a>';
      } else {
         html += '<a class="btn-flat waves-effect add-carousel-btn" href="#">Add to Carousel</a><a class="btn-flat waves-effect remove-carousel-btn hide" href="#">Remove from Carousel</a>';
      }
      html += '</td>';
      return html;
   }

   /**
    * Function to initialize Sortable List.
    */
   function initializeSortableList() {
      var listEl = document.getElementById("carousel-list");
      var list = Sortable.create(listEl, {
         animation: 150,
         filter: '.remove-icon',
         onFilter: function (ev) {
            var box = $(ev.item),
               id = box.data('id');
            box.remove();
            updatePriorityNumber();
            var tableActionsCol = $('.news-table table').find('tr[data-id="' + id + '"] .actions');
            tableActionsCol.find('.add-carousel-btn').removeClass('hide');
            tableActionsCol.find('.remove-carousel-btn').addClass('hide');
         },
         onUpdate: function (ev) {
            updatePriorityNumber();
         }
      }); // That's all.
   }

   /**
    * Function to update Prioirty/Sorting Number to Carousel Boxes
    */
   function updatePriorityNumber() {
      $('.carousel-box').each(function(i, el) {
         $(el).find('.number').html(i+1);
      });
   }

   /**
    * Function to create Carousel JSON to be submitted
    */
   function getCarouselJson() {
      var op= {articles: {}};
      $('.carousel-box').each(function(i, el) {
         var id= $(el).data('id');
         op.articles[i]= id;
      });
      op.articles= JSON.stringify(op.articles);
      return op;
   }
});