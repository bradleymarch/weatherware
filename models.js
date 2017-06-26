const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const moment = require('moment');

mongoose.Promise = global.Promise;
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
/*

userSchema.methods.apiRepr = function() {
	return {
		settings: {

		location: String,
		tempSensitivity: {type: String, default: "neutral"},
		
	},
}
*/
userSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema);

module.exports = {User};