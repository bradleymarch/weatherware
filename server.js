const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

//const autoIncrement = require("mongoose-auto-increment");

const { merge } = require("lodash");

const app = express();
const {PORT, DATABASE_URL, OPEN_WEATHER_MAP_API_KEY} = require("./config");

mongoose.Promise = global.Promise;

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
//userSchema.plugin(autoIncrement.plugin, "User");

const User = mongoose.model("User", userSchema);
//model defines what record looks like
const Forecast = mongoose.model("Forecast", forecastSchema);


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

app.post("/user", (req, res) => {
	console.log(req.body);
	const { username, password } = req.body;
	User.create({
		username, password
	}).then((user) => res.status(201).json({ user }))
	  .catch(error => apiError(res, error));

});

app.get("/user/:id", (req, res) => {

	getUser(req.params.id)
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

app.put("/user/:id", (req, res) => {

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


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			//autoIncrement.initialize(mongoose.connection);
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



module.exports = { app, runServer, closeServer };