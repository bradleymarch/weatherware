Welcome to WeatherWear! WeatherWear is designed to simplify your life. How do we do it? Let me explain.



WeatherWear takes forecast data for your location (from the Open Weather Map API) and provides you with what you need to know MOST about any forecast... WHAT. TO. WEAR!



Sign up for a FREE account, SET your location, and update your controls. That's it. Happy Weathering!


live link to app: http://serene-taiga-87972.herokuapp.com/

![Site Landing Page](/public/images/weatherwearLaptop.png)

Here is a preliminary sketch of the app's user flows:

![Sketch](/public/images/weatherwearSketch.JPG)

Next Steps...

Here are some features I'd like to add as I continue to iterate on this project:
    1. User radio dial settings save with each user
    2. A visual representation of the outfit will display along with the forecast
    3. Users will be able to save their location for the forecast to display immediately as they log in
    4. Email will be added and users will get email alerts on what to wear along with their alarm in the morning

Here is some example code from the frontend:
```
  $(".js-location-form").on("submit", function(event) {

    event.preventDefault();

    $(".waitForIt").removeClass("waitForIt");

    const zipCode = $("#location-input-id").val();
    const OPEN_WEATHER_MAP_API_KEY = "***it's***a***secret***";
    const OPEN_WEATHER_MAP_API_KEY_URL = "***it's***a***secret***"

    $.getJSON(OPEN_WEATHER_MAP_API_KEY_URL, { zip: zipCode }, function(response) {
      const theTemp = response.list[0].temp.max;

      const theConditions = response.list[0].weather[0].description;
      const roundedTemp = theTemp.toFixed();
      const casedConditions = theConditions.toUpperCase();

      $(".js-temp-conditions").html('<p class="tempClass">Temperature' +': ' + roundedTemp + ' °F</p><p  class="conditionsClass">Conditions' +': ' + casedConditions + '</p>');


      if (parseInt(roundedTemp)>= 70) {
        return $(".js-outfit-rec").html("<p>Shorts<br>T-Shirt</p>");
      }

      else if (parseInt(roundedTemp)>= 51 && roundedTemp<= 69) {
        return $(".js-outfit-rec").html("<p>Long Sleeves<br>Long Pants</p>");
      }

      else if (parseInt(roundedTemp)<= 50) 
        return $(".js-outfit-rec").html("<p>Long Sleeves<br>Long Pants<br>Jacket</p>");

    });
    const locationPost = {
      url: "/users/location",
      method: "POST",
      data: JSON.stringify({zipCode:zipCode}),
      contentType: 'application/json',
      dataType: 'json',
    };

    $.ajax(locationPost).done(function (response) {
      if (response.body) {
        res.json(user);

      }
      else {
        $('.js-location-form')[0].reset();
        
      }

    });
  });
```

Here is some example code from the backend:
```
const express = require('express');
const {BasicStrategy} = require('passport-http');
const jsonParser = require('body-parser').json();
const passport = require('passport');
const uuid = require('uuid');
const {User} = require('./models');
const router = express.Router();

router.use(jsonParser);

const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  User
  .findOne({username: username})
  .exec()
  .then(_user => {
    user = _user;
    if (!user) {
      return callback(null, false, {message: 'Incorrect username'});
    }
    return user.validatePassword(password);
  })
  .then(isValid => {
    if (!isValid) {
      return callback(null, false, {message: 'Incorrect password'});
    }
    else {
      return callback(null, user);
    }
  })
  .catch(err => console.log('Invalid username or password'))
});


router.use(require('express-session')({
  secret: 'something something',
  resave: false,
  saveUninitialized: false
}));

passport.use(basicStrategy);
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// POST for creating new user account
router.post('/register', (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }

  let {username, password} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }

  username = username.trim();

  if (username ==='') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  User
  .find({username})
  .count()
  .exec()
  .then(count => {
    if (count > 0) {
      return res.status(422).json({message: 'Username already taken'});
    }
    return User.hashPassword(password);
  })
  .then(hash => {
    return User
    .create({
      username: username,
      password: hash,

    });
  })
  .then(user => {
    return res.status(201).json({user: user.apiRepr(), message: 'New account created!'});
  })
  .catch(err => {

    res.status(500).json({message: 'Internal server error'});
  });
});
```









