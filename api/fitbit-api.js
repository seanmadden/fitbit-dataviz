/**
 * Created by Sean on 4/1/2014.
 */

var OAuth = require('oauth');
var passport = require('passport');
var env = require('../env.json');
var mongoose = require("mongoose");
var User = mongoose.model('User');

var consumerKey = env.dev.consumerKey,
	consumerSecret = env.dev.consumerSecret;

//set up oauth
var oauth = new OAuth.OAuth(
	'https://api.fitbit.com/oauth/request_token',
	'https://api.fitbit.com/oauth/access_token',
	consumerKey,
	consumerSecret,
	'1.0',
	null,
	'HMAC-SHA1'
);

