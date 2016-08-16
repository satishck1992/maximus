$('document').ready(function() {
   'use strict';

   $('select').material_select();

   $('form').submit(function(e) {
      e.preventDefault();
   });

   
});