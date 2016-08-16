$('document').ready(function() {
   'use strict';
   
   $('.slider').slider({
      height: 200
   });

   getFeaturesNewsList()
      .then(function(list) {
         initializeCarouselControl(list);
      });

   function initializeCarouselControl(list) {
      initializeTable(list);
      initializeEvents();
      return true;
   }

   function initializeTable(list) {
      var html= '';
      $.each(list, function(i, item) {
         html+= '<tr><td>'+item.name+'</td><td>';
         if(item.inCarousel) {
            html+= '<a class="btn removeItem">Remove Item</a>';
         } else {
            html+= '<a class="btn addItem">Add Item</a>';
         }
         html+= '</td><td>'+item.order+'</td></tr>';
      });
      $('.all-publishes-news-list').append(html);
   }

   function initializeEvents() {
      $('.all-publishes-news-list .addItem').click(function(e) {
         e.preventDefault();
         var thisRow= $(this).closest('tr');
      });
   }
});

function getFeaturesNewsList() {
   return new Promise(function(fulfill, reject) {
      var SAMPLE_NEWS_LIST= [
         {
            name: 'Know your Managers: Zinedine Zidane',
            inCarousel: false,
            order: 1
         },
         {
            name: 'The Troubled vs The Consistently Consistent: Pakistan vs England',
            inCarousel: false,
            order: 2
         },
         {
            name: 'Know your Clubs: Lille OSC',
            inCarousel: false,
            order: 3
         },
         {
            name: 'Suspicio? Bene ... tunc ibimus? Quis ',
            inCarousel: false,
            order: 0
         },
         {
            name: 'Sorry, buddy. No can do. Pain ',
            inCarousel: false,
            order: 0
         },
         {
            name: 'Ding ding ding ding. Ding. Ding, ',
            inCarousel: false,
            order: 0
         },
         {
            name: 'A tiara... a white gold tiara ',
            inCarousel: false,
            order: 0
         },
         {
            name: 'You are done. Fired. Do not ',
            inCarousel: false,
            order: 0
         },
         {
            name: 'Four pounds... foooour pounds as if two pounds ',
            inCarousel: false,
            order: 0
         },
      ];
      fulfill(SAMPLE_NEWS_LIST);
   });
}