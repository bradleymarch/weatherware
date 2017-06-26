const {BasicStrategy} = require('passport-http');
const express = require('express');
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

/*router.use(require('express-session')({ 
  secret: 'something something',
  resave: false,
  saveUninitialized: false 
}));
*/
passport.use(basicStrategy);
router.use(passport.initialize());
//router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/*function loggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.json({redirect: '/login.html', message: 'Please sign in'});
	}
}

// GET for user to sign in


// GET for user session (protected, must be signed-in already and have session cookie)
//router.get('/me', loggedIn, (req, res, next) => {
 // 	res.json({user: req.user.apiRepr()});
//	}
//);

// GET for user to sign out
/*router.get('/logout', (req, res) => {
	req.session.destroy(function (err) {
  		res.redirect('/');
  	});
});
*/
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

router.get('/login',
	passport.authenticate('Basic', {session: false, failureRedirect: '/login.html'}),
		(req, res) => {
			res.json({message: 'Sign in successful'});
		}
);

// POST (password protected, must have session cookie) for adding a new adjustment entry
/*
router.post('/me/adjustment-entry', loggedIn, (req, res) => {
	if (!req.body) {
		return res.status(400).json({message: 'No request body'});
	}

	const requiredFields = ['name', 'type', 'amount', 'periodUnit', 'periodType', 'startDate', 'endDate'];

	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			return res.status(422).json({message: `Missing field: ${field}`});
		};
	}

	let {name, type, amount, periodUnit, periodType, startDate, endDate} = req.body;

	if (typeof name !== 'string') {
		return res.status(422).json({message: 'Incorrect field type: name'});
	}

	name = name.trim();

	if (name ==='') {
		return res.status(422).json({message: 'Please enter a name'});
	}

	if (typeof amount !== 'number') {
		return res.status(422).json({message: 'Incorrect field type: amount'});
	}

	if (typeof periodUnit !== 'number') {
		return res.status(422).json({message: 'Incorrect field type: amount'});
	}

	if (amount < 1) {
		return res.status(422).json({message: 'Please enter amount'});
	}

	//return User.adjustmentEntries.push(req.body);
	const newAdjustment = {
		id: uuid.v1(),
		name: req.body.name,
		type: req.body.type,
		amount: req.body.amount,
		periodUnit: req.body.periodUnit,
		periodType: req.body.periodType,
		startDate: req.body.startDate,
		endDate: req.body.endDate
	}

	User
		.findOneAndUpdate({username: req.user.username}, 
			{$push: {adjustmentEntries: newAdjustment}},
			{new: true})
		.then(user => res.status(201).json({user: user.apiRepr(), id: newAdjustment.id}))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

// PUT (password protected, must have session cookie) for editing user data 
router.put('/me/username', loggedIn, (req, res) => {

	if (!('username' in req.body)) {
		return res.status(422).json({message: 'Please enter a username'});
	}

	let {username} = req.body;

	if (typeof username !== 'string') {
		return res.status(422).json({message: 'Incorrect field type: username'});
	}

	username = username.trim();

	if (username ==='') {
		return res.status(422).json({message: 'Please enter a username'});
	}

	User
		.find({username})
		.count()
		.exec()
		.then(count => {
			if (count > 0) {
				return res.status(422).json({message: 'Username already taken'});
			}
		})
	
	const updated = { username: req.body.username }

	User
		.findByIdAndUpdate(req.user.id, {$set: updated}, {new: true})
		.then(user => res.status(200).json({user: user.apiRepr()}))
		.catch(err => res.status(500).json({message: 'Error, update failed'}));

});

// PUT (password protected, must have session cookie) for editing most recent balance
router.put('/me/most-recent-balance', loggedIn, (req, res) => {

	const updated = {
		mostRecentBalance: req.body.mostRecentBalance
	};

	User
		.findByIdAndUpdate(req.user.id, {$set: updated}, {new: true})
		.then(user => res.status(200).json({user: user.apiRepr()}))
		.catch(err => res.status(500).json({message: 'Error, update failed'}));
});

// PUT for editing adjustment entries, cookie required
// changes should be an entire adjustment entry include the id
router.put('/me/adjustment-entry', loggedIn, (req, res) => {

	const requiredFields = ['id', 'name', 'type', 'amount', 'periodUnit', 'periodType', 'startDate', 'endDate'];

	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			return res.status(422).json({message: `Missing field: ${field}`});
		};
	}

	User
		.findOneAndUpdate({username: req.user.username, 'adjustmentEntries.id': req.body.id}, 
			{$set: {'adjustmentEntries.$': req.body}}, 
			{new: true})
		.then(user => res.status(200).json({user: user.apiRepr()}))
		.catch(err => res.status(500));
});

// DELETE user account (password protected, must have session cookie)
router.delete('/me', loggedIn, (req, res) => {
	User
		.findByIdAndRemove(req.user.id)
		.then(user => res.status(200).json({redirect: '/'}).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

// DELETE adjustment entry (password protected)
router.delete('/me/adjustment-entry', loggedIn, (req, res) => {
	let requiredField = 'id';

	if(!(requiredField in req.body)) {
			return res.status(422).json({message: `Missing field: ${requiredField}`});
		}

	User
		.findOneAndUpdate({username: req.user.username}, 
				{$pull: {adjustmentEntries: {id: req.body.id}}},
				{new: true})
		.then(updateRes => res.status(200).json({user: updateRes.apiRepr()}))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
})
*/
router.use('*', function(req, res) {
	res.status(404).json({message: 'Not Found'});
});

module.exports = {router};