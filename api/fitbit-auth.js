/**
 * Created by Sean on 3/29/2014.
 */


var OAuth = require('oauth');
var passport = require('passport'),
	FitbitStrat = require('passport-fitbit').Strategy;
var env = require('../env.json');

var api = 'https://api.fitbit.com';

var consumerKey = env.dev.consumerKey,
	consumerSecret = env.dev.consumerSecret;

var token, tokenSecret;
exports.token = function() {
	return token;
};

exports.tokenSecret = function() {
	return tokenSecret;
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Fitbit profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new FitbitStrat({
	consumerKey: consumerKey,
	consumerSecret: consumerSecret,
	callbackURL: "http://localhost:3000/auth/fitbit/callback"
},
	function(t, ts, profile, done) {
		var oauth = new OAuth.OAuth(
			'https://api.fitbit.com/oauth/request_token',
			'https://api.fitbit.com/oauth/access_token',
			consumerKey,
			consumerSecret,
			'1.0',
			null,
			'HMAC-SHA1'
		);

		token = t;
		tokenSecret = ts;

		console.log("TOKEN: " + t);
		console.log("TOKEN-SECRET: " + ts);

		return done(null, profile);

	}
));
