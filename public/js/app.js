$(function() {


   // const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";
   //$locationInput is defined below, trying to figure out how to best organize this...
   // const OPEN_WEATHER_MAP_API_KEY_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + $locationInput + ",us" + "&" + OPEN_WEATHER_MAP_API_KEY;
    /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopNav");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}
  

  const FORECAST = [
  /*{
    day: 'Today',
    forecast: [
    {
      time: 'Morning',
      temp: 75,
      condition: 'Sunny',
      clothes: {

        upperBody: 'short',
        lowerBody: 'short',
        jacket: 'none',
      }
    },
    {
      time: 'Afternoon',
      temp: 79,
      condition: 'Sunny',
      clothes: {

        upperBody: 'short',
        lowerBody: 'short',
        jacket: 'none',
      }
    },
    {
      time: 'Evening',
      temp: 68,
      condition: 'Partly Cloudy',
      clothes: {

        upperBody: 'short',
        lowerBody: 'long',
        jacket: 'none',
      }      
    },
    ],
  },

  {

    day: 'Tomorrow',
    forecast: [
    {
      time: "Morning",
      temp: 56,
      condition: 'Cloudy',
      clothes: {

        upperBody: 'long',
        lowerBody: 'long',
        jacket: 'light',
      }
    },

    {
      time: 'Afternoon',
      temp: 68,
      condition: 'Sunny',
      clothes: {

        upperBody: 'short',
        lowerBody: 'long',
        jacket: "none",
      }
    },

    {
      time: 'Evening',
      temp: 70,
      condition: 'Sunny',
      clothes: {

        upperBody: 'short',
        lowerBody: 'long',
        jacket: "none",
      }
    }



    ]
  }

*/
  ];

 // API functions
 
 //const OPEN_WEATHER_MAP_API_KEY_URL = '/api';
  function handleLocationFormSubmit(event) {
    event.preventDefault();

    const zipCode = $("#location-input-id").val();
    const newSettings = { location: $zipCode.val() };

    updateSettings(newSettings).then(getAndDisplayForecast, displayApiError);

    const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";

    const OPEN_WEATHER_MAP_API_KEY_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + zipCode + ",us" + "&" + "appid=" + OPEN_WEATHER_MAP_API_KEY + "&" + "units=imperial";
    
  }

 function getForecast() {
  
    const zipCode = $("#location-input-id").val();

    const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";

    const OPEN_WEATHER_MAP_API_KEY_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + zipCode + ",us" + "&" + "appid=" + OPEN_WEATHER_MAP_API_KEY + "&" + "units=imperial";
    
  return $.ajax({
    url: `${OPEN_WEATHER_MAP_API_KEY_URL}/forecast`,
    method: "GET",
    dataType: "json",
  });
}

function updateSettings(newSettings) {
    
    const zipCode = $("#location-input-id").val();
    const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";

    const OPEN_WEATHER_MAP_API_KEY_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + zipCode + ",us" + "&" + "appid=" + OPEN_WEATHER_MAP_API_KEY + "&" + "units=imperial";
    
  return $.ajax({
    url: OPEN_WEATHER_MAP_API_KEY_URL,
    method: 'PATCH',
    data: newSettings,
  });
}

//need this to save for user (more than just per session)
function genderSelect() {
    $('#style-box1').on("click", function(){
        $('#blank-figure').attr('src', './images/femaleCold.png');
    });
    $('#style-box2').on("click", function(){
        $('#blank-figure').attr('src', './images/maleCold.png');
    });
    $('#style-box3').on("click", function(){
        $('#blank-figure').attr('src', './images/neutralCold.png');
    });
    console.log('figure.png');
};

genderSelect();
  
   // Display functions

//$(window).scroll(function(){
  //  $("body").css("opacity", 1 - $(window).scrollTop() / 250);
  //});   
   

  // function getForecast(callbackFn) {
 //   setTimeout(function(){ callbackFn(OPEN_WEATHER_MAP_API_KEY_URL)}, 100);
  //}
  
  function displayApiError(error) {
   $(".error-notice").text(error);
 }

 function displayInvalidLocationError() {
  $(".error-notice").text("The location you entered is invalid, please select another one.");
}

function displayForecast() {
  $(".js-forecast").html();
}
  /*   function displayForecast(data) {
        for (const item of data) {
           $('body').append(
            '<p>' + item.icon + '</p>'
            '<p>' + item.temperature + '</p>');
        
        }
  }
 */ 
  function getAndDisplayForecast() {
    getForecast().then(displayForecast, displayApiError);
  }


  
   // Event handlers
   

   function handleSignInFormSubmit(event) {

    $(".js-sign-in-view").addClass("hidden");  
    $(".js-profile-view").removeClass("hidden"); 
  };

  /*function handleLocationFormSubmit(event) {
    event.preventDefault();

    const $form = $(event.currentTarget);
    const $locationInput = $form.find("js-location-input");

    const newSettings = { location: $locationInput.val() };

    updateSettings(newSettings).then(getAndDisplayForecast, displayApiError);

    const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";

    const OPEN_WEATHER_MAP_API_KEY_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + $locationInput + ",us" + "&" + OPEN_WEATHER_MAP_API_KEY;
    
  }
*/
  function handleTempSensitivityChange(event) {
    event.preventDefault();
          //if...always warm
          //else if..else always cold
          //else..neutral
        }

  function handleOutfitStyleChange(event) {

    event.preventDefault();
          //if..male...
          //else if..female...
          //else...neutral...
        }

  
   // Initialize the app
   
   
   $(function onReady() {

    $(".js-sign-in-form").on("submit", handleSignInFormSubmit);



    $(".js-location-input").on("submit", handleLocationFormSubmit);


  });

 });
