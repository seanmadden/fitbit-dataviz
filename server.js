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
    api = env.dev.api;

mongoose.connect("mongodb://localhost/test");
require('./models/user');

var conn = mongoose.connection;
var fitbitAuth = require("./api/fitbit-auth.js");
var User = mongoose.model('User');
var UserInfo = mongoose.model('UserInfo');
var fitbitApi = require("./api/fitbit-api.js");

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
        //Get the user from the db
        User.findOne(
            {encodedId: req.params.userid},
            'accessSecret accessToken joinDate displayName infoByDate',
            //after the user is found, make the api call
            function(err, user) {
                //can return the user directly
                res.send(user);
            }
        );
    }
);

app.get('/api/fitbit/user/refresh/:userid',
    function(req, res) {
        //Get the user from the db
        User.findOne(
            {encodedId: req.params.userid},
            'encodedId accessSecret accessToken joinDate displayName infoByDate',
            //after the user is found, make sure the data is current
            function(err, user) {
                var today = new Date();
                var dateString = today.getFullYear() + '-' + today.getMonth() + '-' + today.getMonth();
                var userInfoUrl = 'https://api.fitbit.com/1/user/' + user.encodedId + '/activities/date/' + dateString +'.json';

                fitbitApi.oauth.get(
                    userInfoUrl,
                    user.accessToken,
                    user.accessSecret,
                    function(e, data, req) {
                        if (data) {
                            data = JSON.parse(data);
                        }
                        //make sure the data is there
                        if (!data || !data.summary) {
                            res.send("error");
                            return;
                        }

                        var temp = new UserInfo();
                        temp.date = dateString;
                        temp.steps = parseInt(data.summary.steps);
                        temp.caloriesOut = parseInt(data.summary.caloriesOut);
                        temp.activeMinutes = parseInt(data.summary.veryActiveMinutes);

                        user.infoByDate.push(temp);

                        user.save(function(err, num, raw) {
                            if (err) console.log(err);
                            console.log("number updated: ", num);
                        });

                        res.send(data);
                    }
                );
            }
        );
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