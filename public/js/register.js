
'use strict';


function registerUser(username, password) {

  var settings = {
    url: '../users/register',
    method: 'POST',
    data: JSON.stringify({username: username, password: password}),
    contentType: 'application/json',
    //dataType: 'json',
    error: function(res) {
      var message = res.responseJSON.message;
      $('.js-error-message').html(message);
    },
  };
$.ajax(settings)
    .done(function (response) {
      $('.js-success-message').html('Logging in...');
      setTimeout(function(){loginUser(username, password)}, 1000);
    })
}
  

function loginUser(username, password) {

  var settings = {
    url: "../users/login",
    method: "GET",
    data: JSON.stringify({username: username, password: password}),
    headers: {
      'content-type': "application/json",
      authorization: "Basic " + btoa(username + ':' + password)
    }
  };

  $.ajax(settings).done(function (response) {
      if (response.user) {
        location.href = '/profile.html';
      }
      else {
        $('.js-error-message').html('Server error.');
      }
  });
}

function watchRegister() {
  $(".js-register-form").submit(function(event) {
    event.preventDefault();
    var username = $("#register_form_username").val();
    var password = $("#register_form_password").val();
    
      registerUser(username, password);
  });
}



$(watchRegister());