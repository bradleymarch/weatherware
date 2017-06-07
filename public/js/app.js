$(function() {

  const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";

  const OPEN_WEATHER_MAP_API_KEY_URL 
  = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=" + OPEN_WEATHER_MAP_API_KEY;

//zip code api callback: "api.openweathermap.org/data/2.5/forecast/daily?zip={zip code},{country code}""

  const FORECAST = [
  {
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


  ];
/**
 * API functions
 */
 const OPEN_WEATHER_MAP_API_KEY_URL = '/api';

 function getForecast() {
  return $.ajax({
    url: `${OPEN_WEATHER_MAP_API_KEY_URL}/forecast`,
    method: "GET",
    dataType: "json",
  });
}

function updateSettings(newSettings) {
  return $.ajax({
    url: OPEN_WEATHER_MAP_API_KEY_URL,
    method: 'PATCH',
    data: newSettings,
  });
}


  /**
   * Display functions
   */
   function getForecast(callbackFn) {
    setTimeout(function(){ callbackFn(OPEN_WEATHER_MAP_API_KEY_URL)}, 100);
  }
  
  function displayApiError(error) {
   $(".error-notice").text(error);
 }

 function displayInvalidLocationError() {
  $(".error-notice").text("The location you entered is invalid, please select another one.");
}

function displayForecast() {
  $(".js-forecast").html(...);
}
     /*function displayForecast(data) {
        for (const item of data) {
           $('body').append(
            '<p>' + item.time + '</p>');
        
        }
  }
  */
  function getAndDisplayForecast() {
    getForecast().then(displayForecast, displayApiError);
  }


  /**
   * Event handlers
   */

   function handleSignInFormSubmit(event) {

    $(".js-sign-in-view").addClass("hidden");  
    $(".js-profile-view").removeClass("hidden"); 
  };

  function handleLocationFormSubmit(event) {
    event.preventDefault();

    $form = $(event.currentTarget);
    $locationInput = $form.find("js-location-input");

    const newSettings = { location: $locationInput.val() };

    updateSettings(newSettings).then(getAndDisplayForecast, displayApiError);
  }
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

  /**
   * Initialize the app
   */
   $(function onReady() {

    $(".js-sign-in-form").on("submit", handleSignInFormSubmit);

    $(".js-location-form").on("submit", handleLocaitonFormSubmit);

  });

 });