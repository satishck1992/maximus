/**
 * Function to set Cookie in browser.
 * @params :
 * 1. cname -> {String} Name of the cookie
 * 2. cvalue -> {String} Value for the cookie
 * 3. exdays -> {Number} No of days to expire cookie on.
 */
function setCookie(cname, cvalue, exdays) {
   var d = new Date();
   d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
   var expires = "expires=" + d.toUTCString();
   document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
 * Function to get Cookie in browser.
 * @params :
 * 1. cname -> {String} Name of the cookie to get
 * @return -> Value of the string if found else empty string.
 */
function getCookie(cname) {
   var name = cname + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}

function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
   }
   return (false);
}

function askUser(msg, response) {
   var userAnswer = confirm(msg);
   response(userAnswer);
}

function getBase64(file) {
   return new Promise(function (fulfill) {
      var FR = new FileReader();
      FR.onload = function (readerEvt) {
         var binaryString = readerEvt.target.result;
         fulfill(btoa(binaryString));
      }
      FR.readAsBinaryString(file);
   });
}

/**
 * Function to redirect user to a page.
 * @param :
 * 1. path -> {String} Location to send user to.
 */
function redirectToPage(path) {
   window.location.href = path;
}

/**
 * Function to Show error message.
 * @params :
 * 1. err_msg -> {String} Error message to be displayed.
 */
function showError(err_msg) {
   Materialize.toast(err_msg, CONST.toast_time, 'error');
}


/**
 * Function to do Admin Control in Page ie. show links that only admin can see.
 */
function adminControl(user_role) {
   if (user_role === 'admin') {
      $(".only_admin").removeClass('hide');
   }
}


function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}