const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {router: usersRouter} = require('./router');
const { merge } = require("lodash");
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const app = express();
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