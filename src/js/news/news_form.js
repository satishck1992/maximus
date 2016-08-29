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
            var id = getQueryVariable('news_id');
            initPreview(id);
         }
      })
      .catch(function (err) {
         showError(err);
         // redirectToPage(CONST.login_page); 
   });

   function initCreateForm() {
      $('form').on('submit', saveNews);
   }

   function saveNews(ev) {
      ev.preventDefault();
      var fdata = formValues();
      fdata.state = 'UnPublished';
      fdata.publish_date = '08/07/91';
      createNews(fdata)
         .then(function (success) {
            askUser('Would you like to add more news', function (userAnswer) {
               if (!userAnswer) {
                  redirectToPage("news.html");
               } else {
                  $('form')[0].reset();
               }
            });
         })
         .catch(function (err) {
            showError(err);
         });
   }

   function initEditForm(id) {
      getSingleNews(id)
         .then(function (news_obj) {
            setFormValues(news_obj);
            Materialize.updateTextFields();

            $('form').on('submit', { id: id }, updateNews);
         })
         .catch(function (err) {
            console.log(err);
         });
   }

   function updateNews(ev) {
      var id = ev.data.id;
      ev.preventDefault();
      var fdata = formValues();
      fdata.state = 'UnPublished';
      fdata.publish_date = '08/07/91';
      editNews(id, fdata)
         .then(function (success) {
            askUser('Would you like to add more news', function (userAnswer) {
               if (!userAnswer) {
                  redirectToPage("news.html");
               } else {
                  $('form')[0].reset();
               }
            });
         })
         .catch(function (err) {
            showError(err);
         });
   }

   function formValues() {
      var obj = {
         'sport_type': $("#news-sportstype").val(),
         'headline': $('#news-headline').val(),
         'article_image_content': document.querySelector('#news-article-image').files[0].name,
         'article_content': $('#news-summary').val(),
         'ice_breaker_content': document.querySelector('#ice-breaker-image').files[0].name,
         'poll_question': $('#news-pollquestion').val(),
         'notification_content': $('#news-notification-content').val()
      }
      return obj;
   }

   function setFormValues(values) {
      $("#news-sportstype").val(values.article_sport_type);
      $('#news-headline').val(values.article_headline);
      $('#news-summary').val(values.article_content);
      $('#news-icebreaker').val();
      $('#news-pollquestion').val(values.article_poll_question);
      $('#news-notification-content').val();
      // document.querySelector('#ice-breaker-image').files[0].name;
      // document.querySelector('#news-article-image').files[0].name;
   }

   function initPreview(id) {
      getSingleNews(id)
         .then(function(news_obj) {
            setFormValues(news_obj);
            Materialize.updateTextFields();
            
            $('form input').attr('readonly', 'readonly');
            $('form textarea').attr('readonly', 'readonly');
            $('form input[type="file"]').attr('disabled', true);
            $('form select').attr('disabled', true);
         
            $('button').hide();
         })
         .catch(function(err) {
            showError(err.statusText);
         });
    }



   // function populateValues(news) {
   //    console.log(news);
   //    $('#news-sportstype').val(news.article_sport_type);
   //    $('#news-headline').val(news.article_headline);
   //    $('#article_content').val(news.article_content);
   //    // $('#news-summary').val(news.)
   // }



   // function formDataCreator(formValues) {
   //    var formData = new FormData();
   //    $.each(formValues, function (i, el) {
   //       var key = el.key,
   //          value = el.value;
   //       formData.append(key, value);
   //    });
   //    return formData;
   // }

   // function saveDraft() { }


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