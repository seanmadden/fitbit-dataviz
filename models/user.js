/**
 * Created by Sean on 4/1/2014.
 * Inspired by https://github.com/jeremiahlee/fitbit-twilio-demo/blob/master/models/user.js
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var UserSchema = new Schema({
	encodedId: {type: String, required: true, index: true, unique: true},
	accessToken: {type: String, required: true},
	accessSecret: {type: String, required: true},
	stepsToday: Number,
	stepsGoal: Number
});

var User = mongoose.model('User', UserSchema);
