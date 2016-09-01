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



function getDataUrl(input_id) {
   return new Promise(function(fulfill) {
      var file = document.querySelector(input_id).files[0];
      var reader = new FileReader();
      var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

      var dataUrl = '';

      reader.addEventListener("loadend", function () {
         console.log(reader);
         // console.log(reader.result);
         // dataUrl = Base64.encode(reader.result);
         // console.log(dataUrl);
         dataUrl= reader.result;
         fulfill(dataUrl);
      });

      if (file) {
         reader.readAsArrayBuffer(file);
      } else {
         fulfill('');
      }
   });
}

var Utils = {
    adminControl: function (user_role) {
        if (user_role === 'admin') {
            $(".only_admin").removeClass('hide');
        }
    },
    askUser: function (msg, response) {
        var userAnswer = confirm(msg);
        response(userAnswer);
    },
    runPageStartup: function (user_role) {
        this.adminControl(user_role);
        $('select').material_select();
    },
    showError: function (err_msg) {
        Materialize.toast(err_msg, CONST.toast_time, 'error');
    },
    showLoading: function () {

        $('#loader').openModal();

    },
    hideLoading: function() {
        $('#loader').closeModal();
    }
}