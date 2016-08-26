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
      .catch(function (err) { redirectToPage(CONST.login_page); });

   function initCreateForm() {
      $('.draft-btn').click(saveDraft);
      $('form').on('submit', saveNews);
   }
   function initEditForm(id) { }
   function initPreview(id) { }

   function getFormValues() {
      return new Promise(function (resolve, reject) {
         var fields = [
            { key: 'headline', id: '#news-headline', type: 'text' },
            { key: 'sport_type', id: '#news-sportstype', type: 'select' },
            { key: 'article_image_content', id: '#news-article-image', type: 'image' },
            { key: 'article_image_name', id: '#news-article-content', type: 'text' },
            { key: 'article_content', id: '#news-summary', type: 'text' },
            { key: 'ice_breaker_name', id: '#news-icebreaker', type: 'text' },
            { key: 'ice_breaker_content', id: '#ice-breaker-image', type: 'image' },
            { key: 'poll_question', id: '#news-pollquestion', type: 'text' },
            { key: 'notification_content', id: '#news-notification-content', type: 'text' },
         ];

         var formValues = fields.map(function (val) {
            var new_val = {};
            new_val.key= val.key;
            new_val.value= $(val.id).val();
            if (val.type === 'image') {
               new_val.value = document.querySelector(val.id).files[0]
            }
            return new_val;
         });

         var formValueObj = {};
         $.each(formValues, function(i, val) {
            formValueObj[val.key]= val.value; 
         });
         // var formValueObj = toObject(formValues);
         getBase64(formValueObj['article_image_content'])
         .then(function(base64Img) {
            formValueObj['article_image_content']= 'data:image/png;base64,'+base64Img;
            return getBase64(formValueObj['ice_breaker_content'])
         })
         .then(function(base64Img) {
            formValueObj['ice_breaker_content']= 'data:image/png;base64,'+base64Img;
            resolve(formValueObj);
         })
         .catch(function() {
            console.log('catch/');
            reject();
         });
      });
   }

   function formDataCreator(formValues) {
      var formData = new FormData();
      $.each(formValues, function (i, el) {
         var key = el.key,
            value = el.value;
         formData.append(key, value);
      });
      return formData;
   }

   function saveNews(ev) {
      ev.preventDefault();
      getFormValues()
         .then(function (formValues) {
            formValues.state= 'UnPublished';
            formValues.publish_date= '08/07/91';
            createNews(formValues)
               .then(function(success) {
                  Materialize.toast('One more?'); 
               })
               .catch(function(err) {
                  console.log(err);
               })
            // var formData= formDataCreator(formValues);
         })
         .catch(function (err) { });
   }
   function saveDraft() { }


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