const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const moment = require('moment');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({

	username: {type: String, required: true},
	password: {type: String, required: true},
	userId: {type: Number, default: 0},
	settings: {

		location: String,
		tempSensitivity: {type: String, default: "neutral"},
		
	},
});

userSchema.methods.apiRepr = function() {
	return {
		username: this.username || '',
		password: this.username || '',
		settings: {

			location: String,
			tempSensitivity: {type: String, default: "neutral"},
			
		},
	};
} 

userSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema);

module.exports = {User};