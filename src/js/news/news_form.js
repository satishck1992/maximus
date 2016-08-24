$('document').ready(function () {
   'use strict';

   getUser()
      .then(function (user_data) {
         var user_name = user_data.user_name;
         var user_role = user_data.user_role;

         adminControl(user_role);
         $('select').material_select();

         var type = getQueryVariable('type');
         if (type === 'add') {
            initCreateForm();
         } else if (type === 'edit') {
            var id = getQueryVariable('news_id');
            initEditForm(id);
         } else {
            initPreview(id);
         }
      })
      .catch(function () { redirectToPage(CONST.login_page); });

   function initCreateForm() {
      bindDraftBtn();
    }
   function initEditForm(id) { }
   function initPreview(id) { }

   function bindDraftBtn() {
      $('.draft-btn').click(function(e) {
         e.preventDefault();
         saveDraftNews();
      });
   }

   // isUserAuthenticated().then(function (user_info) {


   //    var type = getQueryVariable('type');
   //    if (type === 'edit' || type === 'preview') {
   //       var news_id = getQueryVariable('news_id');
   //       getSingleNews(news_id).then(function (news_object) {
   //          populateForm(news_object);
   //       }, function (fail) { });
   //    }
   //    if (type === 'preview') {
   //       $('form input').attr('readonly', true);
   //       $('form button').addClass('hide');
   //    }
   //    if (type === 'add') {
   //       $('form').on('submit', saveForm);
   //       $(".save-as-draft-btn").click(function (ev) {
   //          saveForm(ev, $('form'), 'draft');
   //       });
   //    }

   //    if (type === 'edit') {
   //       $('form').on('submit', saveEditForm);
   //       $(".save-as-draft-btn").click(function (ev) {
   //          saveEditForm(ev, $('form'), 'draft', news_id);
   //       });
   //    }

   //    function populateForm(news) {
   //       $('form #news-sportstype').val(news.sports_type);
   //       $('form #news-headline').val(news.headline);
   //    }

   //    function saveForm(ev, form, status) {
   //       ev.preventDefault();
   //       var form = form ? form : $(this);
   //       var status = status ? status : 'UnPublished';
   //       var isValid = validateFields();
   //       var formData = makeFormObj(form, status);
   //       formData.then(function (data) {
   //          console.log(data);
   //          createNews(data).then(function (success) {
   //             askUser('Would you like to add more news', function (userAnswer) {
   //                if (userAnswer === true) {
   //                   form[0].reset();
   //                } else {
   //                   window.location.href = 'news.html';
   //                }
   //             })
   //          }, function (fail) { });
   //       });
   //    }

   //    function saveEditForm(ev, form, status, news_id) {
   //       ev.preventDefault();
   //       var form = form ? form : $(this);
   //       var status = status ? status : 'unpublished';
   //       var isValid = validateFields();
   //       editNews(news_id, form, status).then(function (success) {
   //          window.location.href = 'news.html';
   //       }, function (fail) { });
   //    }

   //    function validateFields() {
   //       return true;
   //    }

   //    function makeFormObj(form, state) {
   //       return new Promise(function (fulfill) {
   //          var $form = form;
   //          var op = {
   //             sport_type: $form.find('#news-sportstype').val(),
   //             headline: $form.find('#news-headline').val(),
   //             article_image_name: $form.find('#news-article-content').val(),
   //             article_image_content: 'base64',
   //             article_content: $form.find('#news-summary').val(),
   //             ice_breaker_name: $form.find('#news-icebreaker').val(),
   //             ice_breaker_content: 'base64',
   //             poll_question: $form.find('#news-pollquestion').val(),
   //             notification_content: $form.find('#news-notification-content').val(),
   //             stats: [],
   //             memes: [],
   //             publish_date: '08/07/91',
   //             state: state
   //          };
   //          getBase64($("#news-article-image")[0].files[0]).then(function (base64) {
   //             op.article_image_content = base64;
   //             getBase64($("#ice-breaker-image")[0].files[0]).then(function (base64) {
   //                op.ice_breaker_content = base64;
   //                fulfill(op);
   //             });
   //          });
   //       });
   //    }

   // }, function (failure) {
   //    window.location.href = CONST.error_page;
   // });
});