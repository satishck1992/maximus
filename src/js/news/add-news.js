$('document').ready(function () {
   'use strict';

   $('select').material_select();

   var file;
   $('input[type=file]').on('change', prepareUpload);
   function prepareUpload(evnt) {
      file = evnt.target.files;
   }

   $('form').on('submit', uploadNews);
   function uploadNews(event) {
      event.stopPropagation();
      event.preventDefault();

      uploadImages();
   }
   function uploadImages(files) {
      var data = new FormData();
      $.each(files, function (key, value) {
         data.append(key, value);
      });

      $.ajax({
         url: 'localhost',
         type: 'POST',
         data: data,
         cache: false,
         dataType: 'json',
         processData: false,
         contentType: false,
         success: function (data, textStatus, jqXHR) {
            if (typeof data.error === 'undefined') {
               // Success to call function to process the form
               submitForm(event, data);
            } else {
               console.log('ERRORS: ' + data.error);
            }
         },
         error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus);
         }
      })
   }
   function submitForm(event, data) {
      // Create a jQuery object from the form
      $form = $(event.target);

      // Serialize the form data
      var formData = $form.serialize();

      // You should sterilise the file names
      $.each(data.files, function (key, value) {
         formData = formData + '&filenames[]=' + value;
      });

      $.ajax({
         url: 'submit.php',
         type: 'POST',
         data: formData,
         cache: false,
         dataType: 'json',
         success: function (data, textStatus, jqXHR) {
            if (typeof data.error === 'undefined') {
               // Success so call function to process the form
               console.log('SUCCESS: ' + data.success);
            }
            else {
               // Handle errors here
               console.log('ERRORS: ' + data.error);
            }
         },
         error: function (jqXHR, textStatus, errorThrown) {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
         },
         complete: function () {
            // STOP LOADING SPINNER
         }
      });
   }
});