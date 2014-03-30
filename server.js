var express = require("express");
var fitbit_api = require("./api/fitbit-auth.js");
var passport = require("passport");
var OAuth = require("oauth");
var env = require('./env.json');
var app = express();

app.use('/', express.static(__dirname + '/view'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.cookieParser('Battlestar Galactica is so fetch'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000);
console.log("listening on port 3000");

var consumerKey = env.dev.consumerKey,
	consumerSecret = env.dev.consumerSecret;

app.get('/auth/fitbit',
	passport.authenticate('fitbit'),
	function(req, res) {
		//should not be called...
	}
);

app.get('/auth/fitbit/callback',
	passport.authenticate('fitbit'),
	function(req, res) {
		res.redirect('/');
	}
);

app.get('/api/fitbit',
	function(req, res) {
		var oauth = new OAuth.OAuth(
			'https://api.fitbit.com/oauth/request_token',
			'https://api.fitbit.com/oauth/access_token',
			consumerKey,
			consumerSecret,
			'1.0',
			null,
			'HMAC-SHA1'
		);

		oauth.get('https://api.fitbit.com/1/user/2D3YGV/activities/date/2014-03-29.json',
			fitbit_api.token(),
			fitbit_api.tokenSecret(),
			function(e, data, req) {
				console.log(data);
			}
		);
		res.redirect('/');
	}
);