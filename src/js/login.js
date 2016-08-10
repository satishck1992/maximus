$('document').ready(function() {

  // capture login form submit event.
  $('#login-form').submit(function(e) {
    e.preventDefault();
    var user_id= $("#user_name").val();
    var password= $("#password").val();
    var isAuth= authenticate(user_id, password);
    if(!isAuth) {
      $(".result").html('Invalid User');
    } else {
      window.location.href= 'chat.html';
    }
  });
});


/**
 * Function to authenticate User.
 */
function authenticate(user_name, password) {
  var HARD_CODED_USER= {user_name: 'admin', password: 'admin'};
  if(user_name=== HARD_CODED_USER.user_name && password=== HARD_CODED_USER.password) {
    return true;
  } else {
    return false;
  }
}