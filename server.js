const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const {router: usersRouter} = require('./router');
const { merge } = require("lodash");
//const {router: usersRouter} = require('/router');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();

//app.use('/spin', express.static(__dirname + '/node_modules/spin/'));

//app.use('/moment', express.static(__dirname + '/node_modules/moment/'));

app.use(express.static('public'));

app.use(morgan('common'));

app.use('/users', usersRouter);

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on("error", err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
			resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


/*

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

//const autoIncrement = require("mongoose-auto-increment");

const { merge } = require("lodash");
//const {router: usersRouter} = require('/router');
const app = express();
app.use(express.static("public"));
const {PORT, DATABASE_URL, OPEN_WEATHER_MAP_API_KEY} = require("./config");
const bcrypt = require('bcryptjs');
//bcrypt.genSalt(saltRounds, function(err, salt) {
    //bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB. 
    //});
//});
mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;
/*mongoose.connect('mongodb://bmarch:bmarch@ds151951.mlab.com:51951/capstone2');
const forecastSchema = mongoose.Schema({

	day: String,
	forecast: [{

		time: String,
		temp: Number,
		condition: String,
		clothes: {

			upperBody: String,
			lowerBody: String,
			jacket: String,
		}
	}],

});
const counterSchema = new mongoose.Schema({

	_id: { type: String, required: true },
  	seq: { type: Number, default: 0 },

});

const Counter = mongoose.model('Counter', counterSchema);

const userSchema = mongoose.Schema({

	username: {type: String, required: true},
	password: {type: String, required: true},
	userId: {type: Number, default: 0},
	settings: {

		location: String,
		tempSensitivity: {type: String, default: "neutral"},
		outfitStyle: {type: String, default: "neutral"},
	},
});

userSchema.pre('save', function save(next) {
  const document = this;

  Counter.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1} }, { new: true, upsert: true })
    .then(function(count) {
        console.log("...count: "+JSON.stringify(count));
        document.userId = count.seq;
        next();
    })
    .catch(function(error) {
        console.error("counter error-> : "+error);
        throw error;
    });
});
const username = userSchema.username;
const password = userSchema.password;
const Forecast = mongoose.model("Forecast", forecastSchema);
const User = module.exports = mongoose.model("User", userSchema);
const newUser = new User({

	username: username,
	password: password,
});						
module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

app.use(bodyParser.json());

function apiError(res, error) {
  console.log(error);
  return res.status(500).json({ message: "Internal server error!" });
}

function getUser(userId) {

	return User.findById(userId).exec();
}

function getForecast() {

	return getUser();
}

app.post("../user", (req, res) => {
	console.log(req.body);
	const { username, password } = req.body;
	User.create({
		username, password
	}).then((user) => res.status(201).json({ user }))
	  .catch(error => apiError(res, error));

});

app.get("../user", (req, res) => {

	getUser(req.params)
		.then((user) => res.json({ user }))
		.catch((error) => {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	});

});

app.get("/forecast", (req, res) => {

	getForecast()
		.then((forecast) => res.json({ forecast }));
});

app.put("../user", (req, res) => {

	const toUpdate = {}
	const updateableFields = ["username", "password", "settings"];

	updateableFields.forEach(field => {

		if (field in req.body.id) {
			toUpdate[field] = req.body.id[field];
		}
	});

	getUser(req.params.id)
	.then((user) => {
		const newUser = merge({}, user, toUpdate);
	  

	  return res.status(204).json({ user: newUser });
	})
	.catch(err => res.status(500).json({message: "Internal server error"}));


});
const {BasicStrategy} = require('passport-http');
const jsonParser = require('body-parser').json();
const passport = require('passport');
const uuid = require('uuid');

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

function loggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.json({redirect: '/login.html', message: 'Please sign in'});
	}
}

router.get('/login',
	passport.authenticate('basic', {session: true, failureRedirect: '/login.html'}),
		(req, res) => {
			res.json({user: req.user.apiRepr(), message: 'Sign in successful'});
		}
);

router.get('/me', loggedIn, (req, res, next) => {
  	res.json({user: req.user.apiRepr()});
	}
);


router.post('/register', (req, res) => {

	if (!req.body) {
		return res.status(400).json({message: 'No request body'});
	}
	if (!('username' in req.body)) {
		return res.status(422).json({message: 'Missing field: username'});
	}

	let {username, password, firstName, lastName, mostRecentBalance, adjustmentEntries} = req.body;

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
			return res.status(201).json({user: user.apiRepr(), message: 'New account created! Please log in'});
		})
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		});
});

/*
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on("error", err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log("Closing server");
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};


module.exports = { app, runServer, closeServer, User };*/