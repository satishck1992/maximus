$('document').ready(function () {
   'use strict';

   Utils.showLoading();
   Utils.getUser()
      .then(function (user_data) {
         Utils.runPageStartup(user_data.user_role);
         return showCarousel();
      })
      .then(function (list) {
         initializeSortableList();

         $('.remove-carousel-btn').on('click', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr'),
               id = tr.data('id');
            removeItemFromCarousel(id);
         });

         $('.add-carousel-btn').on('click', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr'),
               id = tr.data('id'),
               obj = createCarouselObject(id, list),
               html = htmlCarousel(obj);

            addItemToCarousel(id, html);
         });

         $('.save-carousel').click(function (e) {
            e.preventDefault();
            var carouselJson = getCarouselJson();
            CarouselAPI.createCarousel(carouselJson)
               .then(function () {
                  Materialize.toast('done');
               })
               .catch(function (err) {
                  Utils.showError(err);
               });
         });
         Utils.hideLoading();
      })
      .catch(function (err) {
         Utils.hideLoading();
         Utils.showError(err);
      });


   function showCarousel() {
      return new Promise(function (fulfill, reject) {
         CarouselAPI.getCarouselData()
            .then(function (carousel_data) {
               var combinedData = combineCarouselTableJson(carousel_data.carousel, carousel_data.published);
               displayHTML(combinedData);
               fulfill(combinedData);
            })
            .catch(function (err) {
               reject(err);
            });
      });
   }

   function combineCarouselTableJson(carousel_data, table_data) {
      return table_data.map(function (news, i) {
         var newsObjInCarousel = Utils.searchArray(carousel_data, 'article_id', news.article_id);
         if (newsObjInCarousel) {
            news.priority = newsObjInCarousel.priority + 1;
         } else {
            news.priority = -1;
         }
         return news;
      });
   }

   function displayHTML(list) {
      loadCarousel(list);
      loadTable(list);
   }


   /**
    * Function to create and display Carousels HTML.
    */
   function loadCarousel(carousel_data) {
      var filtered_data = carousel_data.filter(function (data) {
         return data.priority !== -1;
      });
      var sorted_data = filtered_data.sort(function (a, b) {
         return a.priority - b.priority;
      });
      var html = htmlCarousels(sorted_data);
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
    * Ex: {headline, img, id, sports_type, priority}
    */
   function htmlCarousel(carousel) {
      var html = '';
      html += '<div class="carousel-box" data-id="' + carousel.article_id + '">';
      html += '<div class="image" style="background-image: url(' + carousel.article_image + '); background-size: cover;">';
      html += '<div class="banner">';
      html += '<span class="number">' + carousel.priority + '</span>';
      html += '<i class="material-icons remove-icon">clear</i>'
      html += '</div>';
      html += '</div>';
      html += '<div class="carousel-headline">';
      html += carousel.article_headline;
      html += '</div>';
      html += '</div>';
      return html;
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
      console.log(news);
      var html = '';
      html += '<td>' + i + '</td>';
      html += '<td>' + sports_key[news.article_sport_type] + '</td>';
      html += '<td>' + news.article_headline + '</td>';
      html += '<td>' + news.article_publish_date + '</td>';
      html += '<td class="actions">';
      if (news.priority === -1) {
         html += '<a class="btn-flat waves-effect add-carousel-btn" href="#">Add to Carousel</a><a class="btn-flat waves-effect remove-carousel-btn hide" href="#">Remove from Carousel</a>';
      } else {
         html += '<a class="btn-flat waves-effect add-carousel-btn hide" href="#">Add to Carousel</a><a class="btn-flat waves-effect remove-carousel-btn" href="#">Remove from Carousel</a>';
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
            removeItemFromCarousel(id);
         },
         onUpdate: updatePriorityNumber
      }); // That's all.
   }

   function removeItemFromCarousel(id) {
      var tableActionsCol = $('.news-table table').find('tr[data-id="' + id + '"] .actions');
      tableActionsCol.find('.add-carousel-btn').removeClass('hide');
      tableActionsCol.find('.remove-carousel-btn').addClass('hide');
      $("#carousel-list").find('.carousel-box[data-id="' + id + '"]').remove();
      updatePriorityNumber();
   }

   function addItemToCarousel(id, html) {
      var tableActionsCol = $('.news-table table').find('tr[data-id="' + id + '"] .actions');
      tableActionsCol.find('.add-carousel-btn').addClass('hide');
      tableActionsCol.find('.remove-carousel-btn').removeClass('hide');
      $("#carousel-list").append(html);
      updatePriorityNumber();
   }

   function createCarouselObject(article_id, news_list) {
      var op = {};
      var news_obj = Utils.searchArray(news_list, 'article_id', article_id);
      op.article_id = news_obj.article_id;
      op.article_image = news_obj.article_image;
      op.article_headline = news_obj.article_headline;
      op.article_sport_type = news_obj.article_sport_type;
      op.priority = -1;
      return op;
   }

   /**
    * Function to update Prioirty/Sorting Number to Carousel Boxes
    */
   function updatePriorityNumber() {
      $('.carousel-box').each(function (i, el) {
         $(el).find('.number').html(i + 1);
      });
   }

   /**
    * Function to create Carousel JSON to be submitted
    */
   function getCarouselJson() {
      var op = { articles: {} };
      $('.carousel-box').each(function (i, el) {
         var id = $(el).data('id');
         op.articles[i] = id;
      });
      op.articles = JSON.stringify(op.articles);
      return op;
   }
});