'use strict';

function loginUser(username, password) {

  var settings = {
    url: "/users/login",
    method: "GET",
    headers: {
      'content-type': "application/json",
      authorization: "basic" + btoa(username + ':' + password)
    }, 
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
      if (response.user) {
        location.href = '/profile.html';
        //now loggedIn, so MyWeatherWear anchor href now becomes href="profile.html";
        $("#login_to_profile").attr("href", "/profile.html");
      }
      else {
        $('.js-login-form')[0].reset();
        $('.js-error-message').html('Invalid username or password');
      }
  });
}

function watchLogIn() {
  $('.js-login-form').submit(function(event) {
    event.preventDefault();
    var username = $("#login_form_username").val();
    var password = $("#login_form_password").val();
    
    loginUser(username, password);

  })
}

$(watchLogIn());