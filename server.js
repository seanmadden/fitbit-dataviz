var express = require("express");
var passport = require("passport");
var OAuth = require("oauth");
var env = require('./env.json');
var mongoose = require('mongoose');
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
    consumerSecret = env.dev.consumerSecret,
    api = env.dev.api,
    oauth = null;

mongoose.connect("mongodb://localhost/test");
require('./models/user');

var conn = mongoose.connection;
var fitbit_api = require("./api/fitbit-auth.js");
var User = mongoose.model('User');

conn.on('error', function() {
    console.log("error connecting to db");
});

conn.on('open', function() {
    console.log("db open");
});

app.get('/auth/fitbit',
    passport.authenticate('fitbit'),
    function(req, res) {
        //should not be called...
    }
);

app.get('/auth/fitbit/callback',
    passport.authenticate('fitbit'),
    function(req, res) {
        //Has been authenticated, need to get the user details

        res.redirect('/');
    }
);

app.get('/api/fitbit/user/:userid',
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

        //Get the user from the db
        User.findOne(
            {encodedId: req.params.userid},
            'accessSecret accessToken',
            //after the user is found, make the api call
            function(err, user) {
                console.log(user);
                oauth.get('https://api.fitbit.com/1/user/' + req.params.userid + '/activities/date/2014-04-06.json',
                    user.accessToken,
                    user.accessSecret,
                    function(e, data, req) {
                        res.send(data);
                    }
                );
            });
    }
);


app.get('/api/internal/users',
    function(req, res) {
        User.find().exec(function(err, users) {
            if (err) {
                console.error('error fetching users', err);
                return;
            }
            res.send(users);
        });
    }
);