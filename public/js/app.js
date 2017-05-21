$(function() {

const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";

const OPEN_WEATHER_MAP_API_KEY_URL 
= "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=" + OPEN_WEATHER_MAP_API_KEY;



const MOCK_FORECAST = [
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


// this happens after enter a location to SET
  function getForecast(callbackFn) {
      setTimeout(function(){ callbackFn(MOCK_FORECAST)}, 100);
  }

  // this function stays the same when we connect
  // to real API later
  function displayForecast(data) {
      for (const item of data) {
         $('body').append(
          '<p>' + item.time + '</p>');
         console.log(item);
      }
  }

  // this function can stay the same even when we
  // are connecting to real API
  function getAndDisplayForecast() {
      getForecast(displayForecast);
  }



  $(function(addEventListeners) {

    $(".js-sign-in-button").on("submit", function(event) {

      $(".js-sign-in-view").addClass("hidden");  
      $(".js-profile-view").removeClass("hidden"); 
    });

    $(".js-location-button").on("click", function() {
      getAndDisplayForecast();

    });
    

  });
  $(function() {
      addEventListeners();
    });




});