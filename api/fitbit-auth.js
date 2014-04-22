/**
 * Created by Sean on 3/29/2014.
 */


var OAuth = require('oauth');
var passport = require('passport'),
    FitbitStrat = require('passport-fitbit').Strategy;
var env = require('../env.json');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var fitbitApi = require("./fitbit-api.js")

var api = 'https://api.fitbit.com';

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
        consumerKey: fitbitApi.consumerKey,
        consumerSecret: fitbitApi.consumerSecret,
        callbackURL: "http://localhost:3000/auth/fitbit/callback"
    },
    function(t, ts, profile, done) {
        var userProfile = profile._json.user;

        //Save the user to the mongoDB
        User.update({ encodedId: profile.id },
            {
                encodedId: profile.id,
                accessToken: t,
                accessSecret: ts,
                joinDate: userProfile.memberSince
            }, {
                upsert: true
            }, function(err, numberAffected) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('User updated', numberAffected);
                }
            });

        token = t;
        tokenSecret = ts;

        return done(null, profile);
    }
));
