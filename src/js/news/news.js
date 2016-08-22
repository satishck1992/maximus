$('document').ready(function () {
   'use strict';

   var CONST = {
      "error_page": "login.html",
   }

   isUserAuthenticated().then(function (user_info) {
      var user_name = user_info.user_name;
      var user_role = user_info.user_role;


      function fetchNews() {
         var sports_type = $("#filter-sportsType").val();
         var news_status = $("#filter-newsStatusType").val();
         getNews(sports_type, news_status, user_name).then(function (news_list) {
            addNewsToHTMLTable(news_list);
         });
      }

      fetchNews();
      $('.news-table tbody').on("click", "td.actions a", function (ev) { });
      $('select').change(function (ev) {
         fetchNews();
      });

      function addNewsToHTMLTable() { }
   }, function (failure) {
      window.location.href = CONST.error_page;
   });
});