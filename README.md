Welcome to WeatherWear! WeatherWear is designed to simplify your life. How do we do it? Let me explain.



WeatherWear takes forecast data for your location (from the Open Weather Map API) and provides you with what you need to know MOST about any forecast... WHAT. TO. WEAR!



Sign up for a FREE account, SET your location, and update your controls. That's it. Happy Weathering!


live link to app: http://serene-taiga-87972.herokuapp.com/

![Alt text](/public/images/weatherwearLaptop.png)

This is a full-stack application as part of a capstone project with Thinkful's web development bootcamp.
In this project I used HTML, CSS, CSS animations, Javascript, Jquery, Node, Mongoose, Express, Mocha, and Chai.

Here is some example code from the frontend:
```
  $(".js-location-form").on("submit", function(event) {

    event.preventDefault();

    $(".waitForIt").removeClass("waitForIt");

    const zipCode = $("#location-input-id").val();
    console.log(zipCode);
    //save this setting for user each time it is SET
    const OPEN_WEATHER_MAP_API_KEY = "98500b30bcf94df7d89fffc470786b49";
    const OPEN_WEATHER_MAP_API_KEY_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + zipCode + ",us" + "&" + "units=imperial" + "&" + "appid=" + OPEN_WEATHER_MAP_API_KEY;

    $.getJSON(OPEN_WEATHER_MAP_API_KEY_URL, { zip: zipCode }, function(response) {
      const theTemp = response.list[0].temp.max;

      const theConditions = response.list[0].weather[0].description;
      //function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}
      const roundedTemp = theTemp.toFixed();
      const casedConditions = theConditions.toUpperCase();

      $(".js-temp-conditions").html('<p class="tempClass">Temperature' +': ' + roundedTemp + ' °F</p><p class="conditionsClass">Conditions' +': ' + casedConditions + '</p>');


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









