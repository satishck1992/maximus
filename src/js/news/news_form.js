$('document').ready(function () {
   'use strict';

   getUser()
      .then(function (user_data) {
         var user_name = user_data.user_name;
         var user_role = user_data.user_role;

         Utils.runPageStartup(user_data.user_role);

         var type = getQueryVariable('type');
         if (type === 'add') {
            initCreateForm(user_name);
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
      });

   function initCreateForm(user_name) {
      $('.page-title').html('Add Form');
      $('.submit-btn').html('Create News');
      $('#news-headline').characterCounter();
      $('form #username').val(user_name);
      $('form').on('submit', saveNews);
      $('.draft-btn').on('click', draftClicked);

      function draftClicked(ev) {
         $('form #article_state').val('Draft');
         saveNews(ev);
      }
   }

   function saveNews(ev, state) {
      ev.preventDefault();
      Utils.showLoading();
      createNews()
         .then(function (success) {
            Utils.hideLoading();
            askUser('Would you like to add more news', function (userAnswer) {
               if (!userAnswer) {
                  redirectToPage("news.html");
               } else {
                  $('form')[0].reset();
               }
            });
         })
         .catch(function (err) {
            Utils.hideLoading();
            showError(err);
         });
   }

   function initEditForm(id) {
      $('.page-title').html('Edit Form');
      $('.submit-btn').html('Update News');
      $('.draft-btn').hide();
      getSingleNews(id)
         .then(function (news_obj) {
            setFormValues(news_obj);
            Materialize.updateTextFields();
            if (news_obj.article_state === 'Draft') {
               $('.draft-btn').html('Update Draft').show();
            }
            $('.draft-btn').on('click', { id: id, state: 'Draft' }, updateNews);
            if (news_obj.article_image) {
               $('input[type="file"]#article_image').removeAttr('required');
            }
            if (news_obj.article_ice_breaker_image) {
               $('input[type="file"]#article_ice_breaker_image').removeAttr('required');
            }

            $('form').on('submit', { id: id, state: 'UnPublished' }, updateNews);
         })
         .catch(function (err) {
            console.log(err);
         });
   }

   function updateNews(ev) {
      ev.preventDefault();
      formValues()
         .then(function (fdata) {
            var id = ev.data.id;
            fdata.article_state = ev.data.state;
            return editNews(id, fdata);
         })
         .then(function (success) {
            redirectToPage("news.html");
         })
         .catch(function (err) {
            showError(err);
         });
   }

   function dataUrlPromise() {
      return new Promise(function (fulfill, reject) {
         getDataUrl('#news-article-image')
            .then(function (dataUrl) {
               getDataUrl('#ice-breaker-image')
                  .then(function (dataUrl2) {
                     console.log(dataUrl);
                     fulfill({ dataUrl: dataUrl, dataUrl2: dataUrl2 });
                  });
            })
            .catch(function (err) {
               showError(err);
               reject();
            });
      });
   }

   function formValues() {
      return new Promise(function (fulfill, reject) {
         var formData = new FormData();
         var obj = {
            'article_headline': $('#news-headline').val() ? $('#news-headline').val() : '',
            // 'article_image': $('input[type=file]#news-article-image')[0].files[0],
            'article_image': '',
            'article_content': $('#news-summary').val() ? $('#news-summary').val() : '',
            // 'article_ice_breaker_image': $('input[type=file]#ice-breaker-image')[0].files[0],
            'article_ice_breaker_image': 'x',
            'article_poll_question': $('#news-pollquestion').val(),
            'article_notification_content': $('#news-notification-content').val(),
            'article_sport_type': $("#news-sportstype").val(),
         }
         for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
               formData.append(key, obj[key])
            }
         }
         fulfill(formData);
         // dataUrlPromise()
         //    .then(function (result) {
         //    });
      });
   }

   function setFormValues(values) {
      $("#article_sport_type").val(values.article_sport_type);
            $('#article_headline').val(values.article_headline);
            $('#article_content').val(values.article_content);
            $('#article_poll_question').val(values.article_poll_question);
            $('#article_notification_content').val(values.article_notification_content);

      $('select').material_select();
      $("#article_image_file_preview").attr('src', values.article_image).removeClass('hide');
      $('.ice-breaker-img-input .file-path').val(values.article_ice_breaker_image);
      $("#article_ice_breaker_file_preview").attr('src', values.article_ice_breaker_image).removeClass('hide');
      $('.article-img-input .file-path').val(values.article_image);
   }

   function initPreview(id) {
      $('.page-title').html('Preview Form');
      getSingleNews(id)
         .then(function (news_obj) {
            setFormValues(news_obj);
            Materialize.updateTextFields();

            $('form input').attr('readonly', 'readonly');
            $('form textarea').attr('readonly', 'readonly');
            $('form input[type="file"]').attr('disabled', true);
            $('form select').attr('disabled', true);
            $('.article-img-input .file-field').hide();
            $(".ice-breaker-img-input .file-field").hide();
            $('.edit-btn').click(function (e) {
               e.preventDefault();
               window.location.href = "/news_form.html?type=edit&news_id=" + id;
            });

            $('button').hide();
            $('button.edit-btn').removeClass('hide').show();
         })
         .catch(function (err) {
            showError(err.statusText);
         });
   }
});