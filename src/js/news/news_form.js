$('document').ready(function () {
   'use strict';

   var CONST = {
      "error_page": "login.html",
   }

   isUserAuthenticated().then(function (user_info) {

      var user_name = user_info.user_name;
      var user_role = user_info.user_role;

      $('select').material_select();
      if (user_role === 'admin') {
         $(".only_admin").removeClass('hide');
      }
      $('.logout-btn').click(function (e) {
         e.preventDefault();
         logOutUser();
      });

      var type = getQueryVariable('type');
      if (type === 'edit' || type === 'preview') {
         var news_id = getQueryVariable('news_id');
         getSingleNews(news_id).then(function (news_object) {
            populateForm(news_object);
         }, function (fail) { });
      }
      if (type === 'preview') {
         $('form input').attr('readonly', true);
         $('form button').addClass('hide');
      }
      if (type === 'add') {
         $('form').on('submit', saveForm);
         $(".save-as-draft-btn").click(function (ev) {
            saveForm(ev, $('form'), 'draft');
         });
      }

      if (type === 'edit') {
         $('form').on('submit', saveEditForm);
         $(".save-as-draft-btn").click(function (ev) {
            saveEditForm(ev, $('form'), 'draft', news_id);
         });
      }

      function populateForm(news) {
         $('form #news-sportstype').val(news.sports_type);
         $('form #news-headline').val(news.headline);
      }

      function saveForm(ev, form, status) {
         ev.preventDefault();
         var form = form ? form : $(this);
         var status = status ? status : 'unpublished';
         var isValid = validateFields();
         createNews(form, status).then(function (success) {
            askUser('Would you like to add more news', function (userAnswer) {
               if (userAnswer === true) {
                  form[0].reset();
               } else {
                  window.location.href = 'news.html';
               }
            })
         }, function (fail) { });
      }

      function saveEditForm(ev, form, status, news_id) {
         ev.preventDefault();
         var form = form ? form : $(this);
         var status = status ? status : 'unpublished';
         var isValid = validateFields();
         editNews(news_id, form, status).then(function (success) {
            window.location.href = 'news.html';
         }, function (fail) { });
      }

      function validateFields() {
         return true;
      }
   }, function (failure) {
      window.location.href = CONST.error_page;
   });
});