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

router.post('/login',
  passport.authenticate('basic', {session: true}),
  (req, res, err) => {
    console.log(err);
    res.json({user: req.user.apiRepr(), message: 'Sign in successful'});
  }
  );

router.post('/location', (req, res, err) => {
  console.log(req.body);

  User
  .findByIdAndUpdate(req.session.user._id, { $set: { settings:{location: req.body.zipCode} }}, { new: true }, (err, user) => {
    if (err) res.send(err);

    res.json(user);
  }); 

});

/*router.patch('/settings', (req, res, err) => {

  User
  .findById(req.user._id, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
});
*/
router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/index.html');
  });
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.json({redirect: '/login.html', message: 'Please sign in'});
  }
}
// GET for user session (protected, must be signed-in already and have session cookie)
router.get('/me', loggedIn, (req, res, next) => {
  res.json({user: req.user.apiRepr()});
}
);

router.delete('/:id', (req, res) => {
  User
  .findByIdAndRemove(req.user._id)
  .exec()
  .then(doc => {
    if (!doc) { return res.status(404).end(); }
  })
  .catch(err => next(err));
});
router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

module.exports = {router};
