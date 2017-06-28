const express = require('express');
const {BasicStrategy} = require('passport-http');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');
const {User} = require('./models');
const router = express.Router();
//router.use(require('serve-static')(__dirname + '/../../public'));
router.use(require('cookie-parser')());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(require('express-session')({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

const basicStrategy = new BasicStrategy((username, password, callback) => {
	console.log(username, password);
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

passport.use(basicStrategy);

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
	console.log(req.body);

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

router.get('/login',
	passport.authenticate('basic', {session: false}),
		(req, res) => {
			console.log(req.user);
			console.log('hello');
			res.json(req.user, {message: 'Sign in successful'});
		}
);
//do I need to setup an ajax req for this endpoint, or does the <a> href that takes me here cover all bases?
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

router.put('/saveControls', bodyParser, (req, res) => {
	User.update({
    settings: {
    	tempSensitivity: req.params.tempSensitivity,
    }
  });
  res.status(204).end();
});

router.use('*', function(req, res) {
	res.status(404).json({message: 'Not Found'});
});

module.exports = {router};